export function corsHeaders(origin?: string) {
	return {
		'Access-Control-Allow-Origin': origin ?? '*',
		'Access-Control-Allow-Methods': 'GET,OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
	};
}
