import { clear_orders, set_orders } from '../actions';
import orders from '.';

test('clear_orders', () => {
	expect(
		orders.reducer({ navigation: 'stuff' } as any, clear_orders()),
	).toEqual({});
});

test('set_orders', () => {
	expect(
		orders.reducer(
			{ navigation: 'stuff' },
			set_orders({ orders: { navigation: 'potato' } } as any),
		),
	).toMatchObject({
		navigation: 'potato',
		done: true,
	});
});
