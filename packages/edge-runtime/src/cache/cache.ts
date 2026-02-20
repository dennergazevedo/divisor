import type { ICache } from './cache-interface';
import { DEFAULT_LRU_MAX_ENTRIES } from './constants';
import { LRUMemoryCache } from './lru-memory';

let instance: ICache | null = null;

export function cache(): ICache {
	if (instance === null) {
		instance = new LRUMemoryCache(DEFAULT_LRU_MAX_ENTRIES);
	}

	return instance;
}
