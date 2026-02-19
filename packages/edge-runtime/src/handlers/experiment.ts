import { Env, ExperimentResponse } from '../types';

import { getFromCache, setCache } from '../cache/memory';
import { fetchExperimentFromAPI } from '../services/experiments';
import { jsonResponse } from '../utils/response';
import { resolveByPercentage } from '../utils/variant';
import { redisGet, redisSet } from '../services/redis';

export async function handleExperiment(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);

	const tenantId = url.searchParams.get('tenantId');
	const experimentName = url.searchParams.get('name');
	const uid = url.searchParams.get('uid');

	if (!tenantId || !experimentName || !uid) {
		return jsonResponse({ error: 'Missing tenantId, name or uid' }, 400);
	}

	const cacheKey = `experiment:${tenantId}:${experimentName}`;

	let experiment = getFromCache(cacheKey);

	if (!experiment) {
		experiment = await redisGet<ExperimentResponse>(env, cacheKey);

		if (experiment) {
			setCache(cacheKey, experiment, 10_000);
		}
	}

	if (!experiment) {
		experiment = await fetchExperimentFromAPI(env, tenantId, experimentName);

		if (experiment) {
			setCache(cacheKey, experiment, 10_000);
			await redisSet(env, cacheKey, experiment, 60);
		}
	}

	if (!experiment || !experiment.variants || experiment.variants.length === 0) {
		return jsonResponse({ experiment: experimentName, variant: null });
	}

	const variant = resolveByPercentage(uid, tenantId + experimentName, experiment.variants);

	return jsonResponse({
		experiment: experimentName,
		variant,
	});
}
