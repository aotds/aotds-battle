// @format

import fp from 'lodash/fp';

import { play_steps, try_play_turn_mw } from './play_phases';
import { play_turn, try_play_turn } from '../actions/phases';
import { Middleware } from 'redux';
import { test_mw } from '../../middleware/test_fixtures';
jest.mock('../selectors');
const selectors = require('../selectors');

test('play_phases', () => {
    let { dispatch } = test_mw(play_steps);

    expect((dispatch as any).mock.calls.map(fp.get([0, 'type']))).toEqual([
        'MOVEMENT_PHASE',
        'FIRECONS_ORDER_PHASE',
        'WEAPONS_ORDER_PHASE',
        'WEAPONS_FIRING_PHASE',
        'CLEAR_ORDERS',
    ]);
});

describe('try_play_turn', () => {
    test('forced', () => {
        const { dispatch } = test_mw(try_play_turn_mw, {
            action: try_play_turn(true),
        });

        expect(dispatch).toHaveBeenCalledWith(play_turn());
    });

    test('not enough active players', () => {
        selectors.get_players_not_done.mockReturnValue([]);
        selectors.get_active_players.mockReturnValue(['yanick']);

        const { dispatch } = test_mw(try_play_turn_mw, {
            action: try_play_turn(),
        });

        expect(dispatch).not.toHaveBeenCalled();
    });

    test('player not done', () => {
        selectors.get_players_not_done.mockReturnValue(['yanick']);
        selectors.get_active_players.mockReturnValue(['yanick', 'yenzie']);

        const { dispatch } = test_mw(try_play_turn_mw, {
            action: try_play_turn(),
        });

        expect(dispatch).not.toHaveBeenCalled();
    });

    test('all is good!', () => {
        selectors.get_players_not_done.mockReturnValue([]);
        selectors.get_active_players.mockReturnValue(['yanick', 'yenzie']);

        const { dispatch } = test_mw(try_play_turn_mw, {
            action: try_play_turn(),
        });

        expect(dispatch).toHaveBeenCalledWith(play_turn());
    });
});
