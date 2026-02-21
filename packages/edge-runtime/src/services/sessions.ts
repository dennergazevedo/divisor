import { Env } from '../types';
import { redisIncr } from './redis';

export async function trackSession(env: Env, experimentId: string, experimentName: string, variant: string): Promise<void> {
	const key = `experiment:${experimentId}:${experimentName}:${variant}`;
	await redisIncr(env, key);
}
