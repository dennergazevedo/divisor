import { cache, DEFAULT_TTL_MS } from '../cache';
import { fetchExperimentFromAPI } from '../services/experiments';
import { redisGet, redisSet } from '../services/redis';
import { Env, ExperimentResponse } from '../types';
import { jsonResponse } from '../utils/response';
import { resolveByPercentage } from '../utils/variant';

export async function handleExperiment(request: Request, env: Env): Promise<Response> {
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
			if (fromApi) await redisSet(env, cacheKey, fromApi, 60);
			return fromApi;
		},
		DEFAULT_TTL_MS,
	);

	if (!experiment || !experiment.variants || experiment.variants.length === 0) {
		return jsonResponse({ experiment: experimentName, variant: null });
	}

	const isExpired = experiment.endsAt && new Date(experiment.endsAt) < new Date();

	if (isExpired) {
		const sortedVariants = [...experiment.variants].sort((a, b) => b.percent - a.percent);
		const variant = sortedVariants[0].value;

		return jsonResponse({
			experiment: experimentName,
			variant,
		});
	}

	const variant = resolveByPercentage(uid, tenantId + experimentName, experiment.variants);

	return jsonResponse({
		experiment: experimentName,
		variant,
	});
}
