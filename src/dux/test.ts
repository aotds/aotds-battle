import { mockMiddleware } from '../utils/mockMiddleware';
import { dux, playTurnEffect } from '.';

test('tryPlayTurn', () => {
	const playTurn = jest.fn();

	const res = mockMiddleware(playTurnEffect, {
		action: dux.actions.tryPlayTurn(),
		api: {
			getState: {
				allBogeysHaveOrders: () => false,
			},
			dispatch: {
				playTurn,
			},
		},
	});

	expect(playTurn).not.toHaveBeenCalled();

	mockMiddleware(playTurnEffect, {
		action: dux.actions.tryPlayTurn(),
		api: {
			getState: {
				allBogeysHaveOrders: () => true,
			},
			dispatch: {
				playTurn,
			},
		},
	});

	expect(playTurn).toHaveBeenCalled();
});
