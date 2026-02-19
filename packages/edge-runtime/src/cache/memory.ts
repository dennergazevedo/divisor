import { ExperimentResponse } from '../types';

const experimentCache = new Map<
	string,
	{
		data: ExperimentResponse;
		expiresAt: number;
	}
>();

export function getFromCache(key: string): ExperimentResponse | null {
	const cached = experimentCache.get(key);

	if (!cached) return null;

	if (cached.expiresAt < Date.now()) {
		experimentCache.delete(key);
		return null;
	}

	return cached.data;
}

export function setCache(key: string, data: ExperimentResponse, ttlMs: number) {
	experimentCache.set(key, {
		data,
		expiresAt: Date.now() + ttlMs,
	});
}
