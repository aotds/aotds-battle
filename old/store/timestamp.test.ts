import updux from '.';

test('add a timestamp', () => {
	const mw = updux.middleware;
	const next = jest.fn();

	mw({ dispatch: {} } as any)(next as any)({ type: 'noop' });

	expect(next).toHaveBeenCalled();

	expect(next.mock.calls[0][0].meta.timestamp).toMatch(/20\d{2}-\d{2}-\d{2}/);
});
