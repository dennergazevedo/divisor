import type { ICache } from './cache-interface';
import { DEFAULT_LRU_MAX_ENTRIES } from './constants';

interface Entry<T> {
	value: T;
	expiresAt: number;
}

export class LRUMemoryCache implements ICache {
	private cache = new Map<string, Entry<unknown>>();

	constructor(private readonly maxEntries = DEFAULT_LRU_MAX_ENTRIES) {}

	async get<T>(key: string, producer?: () => Promise<T>, ttl?: number): Promise<T | null> {
		const entry = this.cache.get(key) as Entry<T> | undefined;
		if (entry && entry.expiresAt >= Date.now()) {
			// Move to end (most recently used): delete and re-set
			this.cache.delete(key);
			this.cache.set(key, entry);
			return entry.value;
		}
		if (entry && entry.expiresAt < Date.now()) {
			this.cache.delete(key);
		}
		if (producer !== undefined && ttl !== undefined) {
			const value = await producer();
			await this.set(key, value, ttl);
			return value;
		}
		return null;
	}

	async set<T>(key: string, value: T, ttl: number): Promise<void> {
		const isUpdate = this.cache.has(key);
		// Updating existing key: remove first so re-insert moves it to end (most recent)
		if (isUpdate) {
			this.cache.delete(key);
		}
		// Evict oldest (first key in Map insertion order) only when adding a NEW key at capacity
		if (this.cache.size >= this.maxEntries && !isUpdate) {
			const firstKey = Array.from(this.cache.keys())[0];
			if (firstKey !== undefined) {
				this.cache.delete(firstKey);
			}
		}

		this.cache.set(key, {
			value,
			expiresAt: Date.now() + ttl,
		});
	}

	async delete(key: string): Promise<void> {
		this.cache.delete(key);
	}
}
