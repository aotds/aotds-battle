import dux from '.';

const cases = [
	{ state: { hull: 10 }, action: [3], expected: { hull: { current: 7 } } },
	{
		state: { hull: 10, armor: 10 },
		action: [3],
		expected: { hull: { current: 9 }, armor: { current: 8 } },
	},
	{
		state: { hull: 10, armor: 10 },
		action: [3, true],
		expected: { hull: { current: 7 }, armor: { current: 10 } },
	},
	{
		state: { hull: 10, armor: 10 },
		action: [100],
		expected: { hull: { current: -80 }, armor: { current: 0 } },
	},
];

test.each(cases)('%j', ({ state, action, expected }) => {
	const result = dux.reducer(
		dux.inflate(state),
		dux.actions.bogeyDamage(
			'this',
			action[0] as number,
			action[1] as boolean,
		),
	);

	expect(result).toMatchObject(expected);
});
