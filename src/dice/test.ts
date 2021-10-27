jest.mock('lodash');

import { rollDice } from '.';
import { random } from 'lodash';

test('dice', () => {
	[6, 5, 4].forEach((x) => ( random  as any).mockReturnValueOnce(x));

	expect(rollDice(2, { reroll: [6] })).toEqual([6, 5, 4]);

	[6, 5, 6, 3].forEach((x) => ( random as any ).mockReturnValueOnce(x));
	expect(rollDice(2, { reroll: [6] })).toEqual([6, 5, 6, 3]);
});

test('nbr_faces', () => {
	( random as any ).mockImplementation((a, b) => b);
	expect(rollDice(1, { nbr_faces: 99 })).toEqual([99]);
});
