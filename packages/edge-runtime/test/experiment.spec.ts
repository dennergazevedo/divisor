import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleExperiment } from '../src/handlers/experiment';
import * as memoryCache from '../src/cache/memory';
import * as experimentsService from '../src/services/experiments';
import * as redisService from '../src/services/redis';
import { Env } from '../src/types';

vi.mock('../src/cache/memory');
vi.mock('../src/services/experiments');
vi.mock('../src/services/redis');

describe('handleExperiment handler', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return the highest percentage variant when the experiment is expired', async (env: Env) => {
		const pastDate = new Date(Date.now() - 10000).toISOString();
		const experiment = {
			id: 'exp1',
			name: 'test-experiment',
			isActive: true,
			endsAt: pastDate,
			variants: [
				{ value: 'v1', percent: 30 },
				{ value: 'v2', percent: 50 },
				{ value: 'v3', percent: 20 },
			],
		};

		vi.mocked(memoryCache.getFromCache).mockReturnValue(experiment);

		const request = new Request('http://localhost/experiment?tenantId=t1&name=test-experiment&uid=user1');
		const response = await handleExperiment(request, env);

		const data = (await response.json()) as any;
		expect(data.variant).toBe('v2'); // v2 has 50%
	});

	it('should return the first variant when there is a tie in highest percentage and experiment is expired', async (env: Env) => {
		const pastDate = new Date(Date.now() - 10000).toISOString();
		const experiment = {
			id: 'exp1',
			name: 'test-experiment',
			isActive: true,
			endsAt: pastDate,
			variants: [
				{ value: 'v1', percent: 40 },
				{ value: 'v2', percent: 40 },
				{ value: 'v3', percent: 20 },
			],
		};

		vi.mocked(memoryCache.getFromCache).mockReturnValue(experiment);

		const request = new Request('http://localhost/experiment?tenantId=t1&name=test-experiment&uid=user1');
		const response = await handleExperiment(request, env);

		const data = (await response.json()) as any;
		expect(data.variant).toBe('v1'); // v1 is first among 40%
	});

	it('should return resolveByPercentage when the experiment is NOT expired', async (env: Env) => {
		const futureDate = new Date(Date.now() + 10000).toISOString();
		const experiment = {
			id: 'exp1',
			name: 'test-experiment',
			isActive: true,
			endsAt: futureDate,
			variants: [{ value: 'v1', percent: 100 }],
		};

		vi.mocked(memoryCache.getFromCache).mockReturnValue(experiment);

		const request = new Request('http://localhost/experiment?tenantId=t1&name=test-experiment&uid=user1');
		const response = await handleExperiment(request, env);

		const data = (await response.json()) as any;
		expect(data.variant).toBe('v1');
	});

	it('should return resolveByPercentage when endsAt is null', async (env: Env) => {
		const experiment = {
			id: 'exp1',
			name: 'test-experiment',
			isActive: true,
			endsAt: null,
			variants: [{ value: 'v1', percent: 100 }],
		};

		vi.mocked(memoryCache.getFromCache).mockReturnValue(experiment);

		const request = new Request('http://localhost/experiment?tenantId=t1&name=test-experiment&uid=user1');
		const response = await handleExperiment(request, env);

		const data = (await response.json()) as any;
		expect(data.variant).toBe('v1');
	});
});
