import { test, expect, vi } from 'vitest';
import { rollDice } from './index.js';
import { random } from 'Math';

vi.mock('Math', () => {
	const random = vi.fn();
	return { random };
});

test('dice', () => {
	[6, 5, 4].forEach((x) => random.mockReturnValueOnce((x - 1) / 6));

	expect(rollDice(2, { reroll: [6] })).toEqual([6, 5, 4]);

	[6, 5, 6, 3].forEach((x) => random.mockReturnValueOnce((x - 1) / 6));
	expect(rollDice(2, { reroll: [6] })).toEqual([6, 5, 6, 3]);
});

test('nbr_faces', () => {
	random.mockReturnValueOnce(98 / 99);
	expect(rollDice(1, { nbrFaces: 99 })).toEqual([99]);
});
