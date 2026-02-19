import { handleExperiment } from './handlers/experiment';
import { Env } from './types';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/experiment') {
			return handleExperiment(request, env);
		}

		return new Response(JSON.stringify({ status: 'Divisor Edge running' }), {
			headers: { 'content-type': 'application/json' },
		});
	},
};
