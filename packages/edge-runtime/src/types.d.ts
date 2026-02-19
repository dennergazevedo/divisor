export type Env = {
	NEXT_API_BASE_URL: string;
	EDGE_INTERNAL_SECRET: string;
	UPSTASH_REDIS_REST_URL: string;
	UPSTASH_REDIS_REST_TOKEN: string;
};

export type ExperimentResponse = {
	id: string;
	name: string;
	isActive: boolean;
	endsAt: string | null;
	variants: {
		value: string;
		percent: number;
	}[];
};
