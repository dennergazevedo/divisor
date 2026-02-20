export interface ICache {
	get<T>(key: string): Promise<T | null>;
	get<T>(key: string, producer: () => Promise<T>, ttl: number): Promise<T>;
	set<T>(key: string, value: T, ttl: number): Promise<void>;
	delete(key: string): Promise<void>;
}
