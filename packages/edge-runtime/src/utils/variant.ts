import { hashString } from './hash';

export function resolveByPercentage(uid: string, seed: string, variants: { value: string; percent: number }[]): string {
	const hash = hashString(uid + seed);
	const bucket = hash % 100;

	let cumulative = 0;

	for (const variant of variants) {
		cumulative += variant.percent;
		if (bucket < cumulative) {
			return variant.value;
		}
	}

	return variants[0].value;
}
