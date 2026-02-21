import { cache, DEFAULT_TTL_MS } from '../cache';
import { fetchExperimentFromAPI } from '../services/experiments';
import { redisGet, redisSet } from '../services/redis';
import { trackSession } from '../services/sessions';
import { Env, ExperimentResponse } from '../types';
import { jsonResponse } from '../utils/response';
import { resolveByPercentage } from '../utils/variant';

export async function handleExperiment(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url);

	const tenantId = url.searchParams.get('tenantId');
	const experimentName = url.searchParams.get('name');
	const uid = url.searchParams.get('uid');

	if (!tenantId || !experimentName || !uid) {
		return jsonResponse({ error: 'Missing tenantId, name or uid' }, 400);
	}

	const cacheKey = `experiment:${tenantId}:${experimentName}`;

	const experiment = await cache().get<ExperimentResponse | null>(
		cacheKey,
		async () => {
			const fromRedis = await redisGet<ExperimentResponse>(env, cacheKey);
			if (fromRedis) return fromRedis;
			const fromApi = await fetchExperimentFromAPI(env, tenantId, experimentName);
			if (fromApi) await redisSet(env, cacheKey, fromApi);
			return fromApi;
		},
		DEFAULT_TTL_MS,
	);

	if (!experiment || !experiment.variants || experiment.variants.length === 0) {
		return jsonResponse({ experiment: experimentName, variant: null });
	}

	console.log('experiment', experiment);

	// 1. Check Plan Expiration (Owner)
	// If the plan has expired, do not return anything (including variant)
	const isPlanExpired = experiment.owner?.expiration_date && new Date(experiment.owner.expiration_date) < new Date();
	if (isPlanExpired && experiment.owner?.current_plan !== 'free') {
		return jsonResponse({ experiment: experimentName, variant: null });
	}

	// 2. Determine Session Limit based on Plan
	// Free/Inactive: 1,000 | Growth: 5,000,000 | Pro: Unlimited
	let limit = 1000;
	if (experiment.owner?.current_plan === 'pro') {
		limit = Infinity;
	} else if (experiment.owner?.current_plan === 'growth') {
		limit = 5000000;
	} else if (experiment.owner?.plan_status === 'active' && !isPlanExpired) {
		// If active and not expired but not pro/growth, check if it's free
		limit = 1000;
	}

	// 3. Check Session Count (if not Pro)
	if (limit !== Infinity) {
		const sessionKey = `divisor_plan:sessions:${experiment.owner?.user_id}`;
		console.log('sessionKey', sessionKey);
		const currentSessions = (await redisGet<number>(env, sessionKey)) || 0;

		if (currentSessions >= limit) {
			return jsonResponse({
				experiment: experimentName,
				message: "You've reached the session limit for your current plan. Please upgrade to a higher plan to continue running experiments.",
			});
		}
	}

	// 4. Resolve Variant
	const isExperimentExpired = experiment.endsAt && new Date(experiment.endsAt) < new Date();

	let variant: string;

	if (isExperimentExpired) {
		const sortedVariants = [...experiment.variants].sort((a, b) => b.percent - a.percent);
		variant = sortedVariants[0].value;
	} else {
		variant = resolveByPercentage(uid, tenantId + experimentName, experiment.variants);
	}

	// 5. Track session (including owner session) in the background
	ctx.waitUntil(trackSession(env, experiment.id, experimentName, variant, experiment.owner?.user_id || ''));

	return jsonResponse({
		experiment: experimentName,
		variant,
	});
}
