// @format

import fp from 'lodash/fp';
import Battle from '../battle/index';
import initial_state from './initial_state';
import { init_game, try_play_turn } from '../store/actions/phases';
import { Action } from '../reducer/types';
import { set_orders } from '../store/bogeys/bogey/actions';

let turns: ((battle: Battle) => void)[] = [];

turns[0] = (battle: Battle) => {
    expect(battle).toBeTruthy();
    expect(battle.state).toMatchObject({});
};

turns[1] = battle => {
    battle.dispatch(init_game(initial_state));

    expect(battle.state).toMatchObject({
        game: { name: 'gemini', turn: 0 },
        bogeys: { enkidu: { name: 'Enkidu' }, siduri: { name: 'Siduri' } },
    });

    // let's check the log
    expect(battle.state).toHaveProperty('log');

    expect(battle.state.log.map((l: Action) => l.type)).toEqual(['INIT_GAME']);

    let enkidu_orders = { thrust: 1, turn: 1, bank: 1 };

    battle.dispatch(
        set_orders('enkidu', {
            navigation: enkidu_orders,
        }),
    );

    battle.dispatch(try_play_turn());

    // not yet...
    expect(battle.state).toHaveProperty('game.turn', 0);

    battle.dispatch(
        set_orders('siduri', {
            navigation: { thrust: 1 },
        }),
    );

    expect(battle.state.bogeys.enkidu).toMatchObject({ orders: { navigation: enkidu_orders } });

    // let's check the log
    expect(battle.state).toHaveProperty('log');

    expect(battle.state.log.map((l: any) => l.type).filter((t: string) => !/@@/.test(t))).toEqual([
        'INIT_GAME',
        'SET_ORDERS',
        'SET_ORDERS',
    ]);

    battle.dispatch(try_play_turn());

    // a turn has been done!
    expect(battle.state.log.find((entry: any) => entry.type === 'PLAY_TURN')).toBeTruthy();
};

test('sample game', () => {
    let battle = new Battle({
        //devtools: {
        // suppressConnectErrors: false,
        // wsEngine: 'uws',
        //},
    });

    turns.forEach(turn => turn(battle));
});
