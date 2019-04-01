// @format

import fp from 'lodash/fp';

import { play_steps, mw_try_play_turn } from './play_phases';
import { play_turn, try_play_turn } from '../actions/phases';
import { Middleware } from 'redux';
import { test_mw } from '../../middleware/test_fixtures';
jest.mock('../selectors');
const selectors = require('../selectors');

test('play_phases', () => {
    let dispatch = jest.fn();
    let next = jest.fn();

    let gen = play_steps({ dispatch } as any)(next)({});

    expect(dispatch.mock.calls.map(fp.get([0, 'type']))).toEqual([
        'MOVEMENT_PHASE',
        'FIRECONS_ORDER_PHASE',
        'WEAPONS_ORDER_PHASE',
        'WEAPONS_FIRING_PHASE',
        'CLEAR_ORDERS',
    ]);
});

describe('try_play_turn', () => {
    // try_play_turn when not all players are ready
    // try_play_turn when only one player
    // try_play_turn forced

    test('forced', () => {
        const { dispatch } = test_mw(mw_try_play_turn, {
            action: try_play_turn(true),
        });

        expect(dispatch).toHaveBeenCalledWith(play_turn());
    });

    test('not enough active players', () => {
        selectors.get_players_not_done.mockReturnValue([]);
        selectors.get_active_players.mockReturnValue(['yanick']);

        const { dispatch } = test_mw(mw_try_play_turn, {
            action: try_play_turn(),
        });

        expect(dispatch).not.toHaveBeenCalled();
    });

    test('player not done', () => {
        selectors.get_players_not_done.mockReturnValue(['yanick']);
        selectors.get_active_players.mockReturnValue(['yanick', 'yenzie']);

        const { dispatch } = test_mw(mw_try_play_turn, {
            action: try_play_turn(),
        });

        expect(dispatch).not.toHaveBeenCalled();
    });

    test('all is good!', () => {
        selectors.get_players_not_done.mockReturnValue([]);
        selectors.get_active_players.mockReturnValue(['yanick', 'yenzie']);

        const { dispatch } = test_mw(mw_try_play_turn, {
            action: try_play_turn(),
        });

        expect(dispatch).toHaveBeenCalledWith(play_turn());
    });
});
