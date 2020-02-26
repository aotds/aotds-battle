import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';

import initial_state from './initial_state';
// import { set_orders } from '../store/bogeys/bogey/actions';
import { Action, ActionCreator } from '../reducer/types';
import { LogState, LogAction } from '../store/log/reducer/types';

// import { init_game, try_play_turn, play_turn, weapons_firing_phase, fire_weapon } from '../store/actions/phases';

import battle from '../store';

const {
        init_game, set_orders, try_play_turn, play_turn
    } = battle.actions;

console.log(battle.actions);

import { without_ts  } from './utils';

export const actions = [
    init_game(initial_state),
    set_orders('enkidu', {
        navigation: { thrust: 1, turn: 1, bank: 1 },
    }),
    try_play_turn(),
    set_orders('siduri', {
        navigation: { thrust: 1 },
    }),
    play_turn(),
];

export const tests = state => {
    expect(state).toHaveProperty('game.turn', 1);

    expect(state).toMatchObject({
        game: { name: 'gemini', turn: 1 },
        bogeys: { enkidu: { name: 'Enkidu' }, siduri: { name: 'Siduri' } },
    });

    // let's check the log
    expect(state).toHaveProperty('log');

    expect(state.log.map((l: Action) => l.type)).toContain('INIT_GAME');

    // a turn has been done!
    expect(state.log.find((entry: any) => entry.type === 'PLAY_TURN')).toBeTruthy();

    // orders cleared out
    let still_with_orders = fp.flow(
        fp.get('bogeys'),
        fp.values,
        fp.filter(bogey => _.keys(bogey.orders).length > 0),
    )(state);

    expect(still_with_orders).toEqual([]);

    // Enkidu still have a drive section
    expect(state.bogeys.enkidu).toHaveProperty('drive.current');

    expect(state.log.filter((a: any) => a.type === 'PUSH_ACTION_STACK')).toHaveLength(0);

    expect(without_ts(state)).toMatchSnapshot();

    expect(state.bogeys.enkidu.navigation).toMatchObject({
        heading: 1,
        velocity: 1,
        coords: [1.5, 0.87],
    });

    expect(state.bogeys.siduri.navigation).toMatchObject({
        heading: 6,
        velocity: 1,
        coords: [10, 9],
    });
};
