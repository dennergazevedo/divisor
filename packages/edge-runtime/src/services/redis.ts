import { Env } from '../types';

export async function redisGet<T>(env: Env, key: string): Promise<T | null> {
	const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/get/${key}`, {
		headers: {
			Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
		},
	});

	if (!res.ok) return null;

	const data: any = await res.json();

	if (!data.result) return null;

	if (typeof data.result === 'string') {
		try {
			return JSON.parse(data.result) as T;
		} catch {
			return null;
		}
	}

	return data.result as T;
}

export async function redisSet(env: Env, key: string, value: unknown): Promise<void> {
	await fetch(`${env.UPSTASH_REDIS_REST_URL}/set/${key}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(value),
	});
}

export async function redisIncr(env: Env, key: string): Promise<number> {
	const res = await fetch(`${env.UPSTASH_REDIS_REST_URL}/incr/${key}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
		},
	});

	if (!res.ok) return 0;

	const data: any = await res.json();
	return Number(data.result);
}
