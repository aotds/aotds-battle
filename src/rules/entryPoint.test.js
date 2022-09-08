import V from '@a-robu/victor';
import { test, expect, vi } from 'vitest';

let rollDice;
vi.mock('../dice/index.js', () => {
	rollDice = vi.fn();

	return { rollDice };
});

import { entryPoint } from './entryPoint.js';

test('basic', () => {
	rollDice.mockReturnValueOnce([90, 50]);

	const result = entryPoint();

	expect(result).toHaveLength(2);

	expect(V.fromArray(result).length()).toBeLessThan(50);
	expect(V.fromArray(result).length()).toBeGreaterThan(40);
});

test('avoid others', () => {
	rollDice.mockReturnValueOnce([90, 50]);

	rollDice.mockReturnValue([5, 5]);
	const result = entryPoint([[35, -25]]);

	expect(result).toEqual([51, -11]);

	expect(V.fromArray(result).distance(new V(35, -25))).toBeGreaterThan(20);
});
