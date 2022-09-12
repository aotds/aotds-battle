import { beforeEach, describe, test, expect, vi } from 'vitest';
import u from 'updeep';

import { checkNextTurn } from './checkNextTurn';

const fullState = {
	game: { turn: 0, players: [{ name: 'yanick' }, { name: 'yenzie' }] },
	bogeys: [
		{ player: 'yanick', orders: [{ type: 'dummy' }] },
		{ player: 'yenzie', orders: [{ type: 'dummy' }] },
	],
};

const playNextTurn = vi.fn();

const dispatch = {
	playNextTurn,
};

const getState = vi.fn();

const next = () => {};

describe('turn 0', () => {
	beforeEach(() => {
		playNextTurn.mockReset();
	});

	test('no players', () => {
        getState.mockReturnValue(u.updateIn('game.players', [], fullState ));

		checkNextTurn({ getState, dispatch })(next)({});

		expect(playNextTurn).not.toHaveBeenCalled();
	});

	test('players, but no orders', () => {
        getState.mockReturnValue(
            u({bogeys: u.map(
            { orders: []}
        )}, fullState));

		checkNextTurn({ getState, dispatch })(next)({});

		expect(playNextTurn).not.toHaveBeenCalled();
	});

	test('players, but no orders for all ships', () => {
		getState.mockReturnValue(u.updateIn('bogeys.1.orders', [], fullState));

		checkNextTurn({ getState, dispatch })(next)({});

		expect(playNextTurn).not.toHaveBeenCalled();
	});

	test('players and orders for all ships', () => {
		getState.mockReturnValue(fullState);

		checkNextTurn({ getState, dispatch })(next)({});

		expect(dispatch.playNextTurn).toHaveBeenCalled();
	});
});
