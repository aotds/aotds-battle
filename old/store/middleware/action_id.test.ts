import { action_id_mw_gen } from './action_id';
import { test_mw } from '../../middleware/test_fixtures';

test('add action ids', () => {
	let mw = action_id_mw_gen();

	let { next } = test_mw(mw) as any;
	expect(next.mock.calls[0][0]).toHaveProperty('meta.action_id', 1);

	next = test_mw(mw).next as any;
	expect(next.mock.calls[0][0]).toHaveProperty('meta.action_id', 2);
});

test('add action ids with logs', () => {
	let mw = action_id_mw_gen();

	let { next } = test_mw(mw, {
		getState: () => ({ log: [{ meta: { action_id: 65 } }] }),
	}) as any;

	expect(next.mock.calls[0][0]).toHaveProperty('meta.action_id', 66);
});
