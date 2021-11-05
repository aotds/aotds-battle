import dux from '.';

describe('effectiveLevel', () => {
	test.each([
		{ shields: [], result: 0 },
		{ shields: [1, 1, 2], result: 2 },
		{ shields: [1, 1, 1], result: 1 },
		{ shields: [1, 1, { level: 2, damaged: true }], result: 1 },
	])('%j', ({ shields, result }) => {
		expect(
			dux.selectors.effectiveShieldLevel(dux.inflate(shields)),
		).toEqual(result);
	});
});
