import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleExperiment } from '../src/handlers/experiment';
import * as experimentsService from '../src/services/experiments';
import * as redisService from '../src/services/redis';
import { Env } from '../src/types';

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockDelete = vi.fn();

vi.mock('../src/cache', () => ({
	cache: vi.fn(() => ({
		get: mockGet,
		set: mockSet,
		delete: mockDelete,
	})),
	DEFAULT_TTL_MS: 10_000,
}));
vi.mock('../src/services/experiments');
vi.mock('../src/services/redis');

const mockEnv = {} as Env;

describe('handleExperiment handler', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return the highest percentage variant when the experiment is expired', async () => {
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

		mockGet.mockResolvedValue(experiment);

		const request = new Request('http://localhost/experiment?tenantId=t1&name=test-experiment&uid=user1');
		const response = await handleExperiment(request, mockEnv);

		const data = (await response.json()) as any;
		expect(data.variant).toBe('v2'); // v2 has 50%
	});

	it('should return the first variant when there is a tie in highest percentage and experiment is expired', async () => {
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

		mockGet.mockResolvedValue(experiment);

		const request = new Request('http://localhost/experiment?tenantId=t1&name=test-experiment&uid=user1');
		const response = await handleExperiment(request, mockEnv);

		const data = (await response.json()) as any;
		expect(data.variant).toBe('v1'); // v1 is first among 40%
	});

	it('should return resolveByPercentage when the experiment is NOT expired', async () => {
		const futureDate = new Date(Date.now() + 10000).toISOString();
		const experiment = {
			id: 'exp1',
			name: 'test-experiment',
			isActive: true,
			endsAt: futureDate,
			variants: [{ value: 'v1', percent: 100 }],
		};

		mockGet.mockResolvedValue(experiment);

		const request = new Request('http://localhost/experiment?tenantId=t1&name=test-experiment&uid=user1');
		const response = await handleExperiment(request, mockEnv);

		const data = (await response.json()) as any;
		expect(data.variant).toBe('v1');
	});

	it('should return resolveByPercentage when endsAt is null', async () => {
		const experiment = {
			id: 'exp1',
			name: 'test-experiment',
			isActive: true,
			endsAt: null,
			variants: [{ value: 'v1', percent: 100 }],
		};

		mockGet.mockResolvedValue(experiment);

		const request = new Request('http://localhost/experiment?tenantId=t1&name=test-experiment&uid=user1');
		const response = await handleExperiment(request, mockEnv);

		const data = (await response.json()) as any;
		expect(data.variant).toBe('v1');
	});
});
