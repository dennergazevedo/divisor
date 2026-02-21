import { Env } from '../types';
import { redisIncr } from './redis';

export async function trackSession(
	env: Env,
	experimentId: string,
	experimentName: string,
	variant: string,
	userId: string,
): Promise<number> {
	const key = `experiment:${experimentId}:${experimentName}:${variant}`;
	const ownerKey = `divisor_plan:sessions:${userId}`;

	// Increment both, but return the owner's session count for limit check
	await redisIncr(env, key);
	return await redisIncr(env, ownerKey);
}
