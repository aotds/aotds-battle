import { mockMiddleware } from '../utils/mockMiddleware';
import { dux, playTurnEffect } from '.';

test('playTurn', () => {
	let res = mockMiddleware(playTurnEffect, {
		action: dux.actions.playTurn(true),
	});

	expect(res.next).toHaveBeenCalled();

	res = mockMiddleware(playTurnEffect, {
		action: dux.actions.playTurn(false),
		api: {
			getState: {
				allBogeysHaveOrders: () => false,
			},
		},
	});

	expect(res.next).not.toHaveBeenCalled();

	res = mockMiddleware(playTurnEffect, {
		action: dux.actions.playTurn(false),
		api: {
			getState: {
				allBogeysHaveOrders: () => true,
			},
		},
	});

	expect(res.next).toHaveBeenCalled();
});
