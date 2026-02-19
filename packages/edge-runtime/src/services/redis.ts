import { Env } from '../types';

export async function redisGet<T>(env: Env, key: string): Promise<T | null> {
	const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
		headers: {
			Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
		},
	});

	if (!res.ok) return null;

	const data: any = await res.json();
	return data.result ?? null;
}

export async function redisSet(env: Env, key: string, value: unknown, ttlSeconds: number): Promise<void> {
	await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${key}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			value,
			ex: ttlSeconds,
		}),
	});
}
