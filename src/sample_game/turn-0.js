import { expect, test } from 'vitest';

export const tests = (state) => {
	test('we have our subduxes', () => {
		expect(state).toHaveProperty('actionId');
		expect(state).toHaveProperty('log');
	});
};
