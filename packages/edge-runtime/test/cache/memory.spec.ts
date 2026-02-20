import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MemoryCache } from '../../src/cache';

const TTL_LONG = 10_000;
const TTL_SHORT = 100;

describe('MemoryCache', () => {
	let cache: MemoryCache;

	beforeEach(() => {
		cache = new MemoryCache();
	});

	it('get returns null for missing key', async () => {
		expect(await cache.get('missing')).toBe(null);
	});

	it('set then get returns the value', async () => {
		await cache.set('key', 'value', TTL_LONG);

		expect(await cache.get('key')).toBe('value');
	});

	it('get returns null after TTL expires', async () => {
		vi.useFakeTimers();
		vi.setSystemTime(0);

		await cache.set('key', 'value', TTL_SHORT);

		vi.advanceTimersByTime(TTL_SHORT + 1);
		expect(await cache.get('key')).toBe(null);
		vi.useRealTimers();
	});

	it('delete removes the key', async () => {
		await cache.set('key', 'value', TTL_LONG);
		await cache.delete('key');

		expect(await cache.get('key')).toBe(null);
	});

	it('multiple keys are independent', async () => {
		await cache.set('a', 1, TTL_LONG);
		await cache.set('b', 'two', TTL_LONG);
		await cache.set('c', { id: 3 }, TTL_LONG);

		expect(await cache.get('a')).toBe(1);
		expect(await cache.get('b')).toBe('two');
		expect(await cache.get<{ id: number }>('c')).toEqual({ id: 3 });

		await cache.delete('b');

		expect(await cache.get('a')).toBe(1);
		expect(await cache.get('b')).toBe(null);
		expect(await cache.get('c')).toEqual({ id: 3 });
	});

	it('get<Type> returns correctly typed value', async () => {
		const value = { id: 'x', name: 'test' };
		await cache.set('key', value, TTL_LONG);
		const result = await cache.get<{ id: string; name: string }>('key');

		expect(result).not.toBe(null);
		expect(result!.id).toBe('x');
		expect(result!.name).toBe('test');
	});

	it('get with producer callback computes on miss and sets cache', async () => {
		const producer = vi.fn().mockResolvedValue(42);

		expect(await cache.get('key')).toBe(null);

		const value = await cache.get('key', producer, TTL_LONG);

		expect(value).toBe(42);
		expect(producer).toHaveBeenCalledTimes(1);
		expect(await cache.get('key')).toBe(42);
	});

	it('get with producer returns cached value on hit without calling producer', async () => {
		await cache.set('key', 'cached', TTL_LONG);
		const producer = vi.fn().mockResolvedValue('new');

		const value = await cache.get('key', producer, TTL_LONG);

		expect(value).toBe('cached');
		expect(producer).not.toHaveBeenCalled();
	});
});
