import { Env, ExperimentResponse } from '../types';

export async function fetchExperimentFromAPI(env: Env, tenantId: string, experimentName: string): Promise<ExperimentResponse | null> {
	const res = await fetch(`${env.NEXT_API_BASE_URL}/api/experiments/find?tenantId=${tenantId}&name=${experimentName}`, {
		method: 'GET',
		headers: {
			'x-edge-secret': env.EDGE_INTERNAL_SECRET,
		},
	});

	if (!res.ok) {
		return null;
	}

	return res.json();
}
