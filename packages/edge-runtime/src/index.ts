import { handleExperiment } from './handlers/experiment';
import { Env } from './types';
import { corsHeaders } from './utils/cors';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: corsHeaders(request.headers.get('Origin') ?? undefined),
			});
		}

		if (url.pathname === '/experiment') {
			const response = await handleExperiment(request, env);

			const headers = new Headers(response.headers);
			const origin = request.headers.get('Origin') ?? '*';

			Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
				headers.set(key, value);
			});

			return new Response(response.body, {
				status: response.status,
				headers,
			});
		}

		return new Response(JSON.stringify({ status: 'Divisor Edge running' }), {
			headers: {
				'content-type': 'application/json',
				...corsHeaders(request.headers.get('Origin') ?? undefined),
			},
		});
	},
};
