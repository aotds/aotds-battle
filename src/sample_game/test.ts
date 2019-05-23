// @format

import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import Battle from '../battle/index';
import initial_state from './initial_state';
import { init_game, try_play_turn, play_turn, weapons_firing_phase } from '../store/actions/phases';
import { Action, ActionCreator } from '../reducer/types';
import { set_orders } from '../store/bogeys/bogey/actions';
import { LogState, LogAction } from '../store/log/reducer/types';
import { get_bogey } from '../store/selectors';
import { isType } from 'ts-action';

expect.addSnapshotSerializer({
    test: () => true,
    print: val => JSON.stringify(val, null, 2),
});

let turns: ((battle: Battle) => void)[] = [];

function scrub_timestamps(log: LogState) {
    return u.map(
        {
            meta: u.omit(['timestamp']),
            subactions: u.if(_.identity, scrub_timestamps),
        },
        log,
    );
}

const without_ts = u({ log: scrub_timestamps });

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

    expect(battle.state.game).toMatchObject({ turn: 1 });

    expect(_.omit(battle.state, ['log'])).toMatchSnapshot();

    // orders cleared out
    let still_with_orders = fp.flow(
        fp.get('bogeys'),
        fp.values,
        fp.filter(bogey => _.keys(bogey.orders).length > 0),
    )(battle.state);

    expect(still_with_orders).toEqual([]);

    // Enkidu still have a drive section
    expect(battle.state.bogeys.enkidu).toHaveProperty('drive.current');

    expect(battle.state.log.filter((a: any) => a.type === 'PUSH_ACTION_STACK')).toHaveLength(0);

    const state = battle.state;

    expect(without_ts(state)).toMatchSnapshot();

    expect(battle.state.bogeys.enkidu.navigation).toMatchObject({
        heading: 1,
        velocity: 1,
        coords: [1.5, 0.87],
    });

    expect(battle.state.bogeys.siduri.navigation).toMatchObject({
        heading: 6,
        velocity: 1,
        coords: [10, 9],
    });
};

const debug = require('debug')('aotds:sample');

const flattenLog = (log: any): any => {
    return _.flatten(log.map((e: any) => (e.subactions ? [e, ...flattenLog(e.subactions)] : [e]))).map((e: any) =>
        _.omit(e, 'subactions'),
    );
};

const filterLogAction = _.curry(
    (action: ActionCreator, log: LogState | LogAction = []): LogState => {
        if (!_.isArray(log)) log = [log];

        return log.reduce((accum: LogState, logEntry: LogAction) => {
            if (isType(logEntry, action)) accum = [...accum, logEntry];
            return [...accum, ...filterLogAction(action, _.get(logEntry, 'subactions', []))];
        }, []);
    },
);

turns[2] = battle => {
    battle.dispatch(
        set_orders('enkidu', {
            firecons: [{ target_id: 'siduri' }],
            weapons: [{ firecon_id: 0 }, { firecon_id: 0 }, { firecon_id: 0 }],
        }),
    );

    // rig_dice([ 6, 5, 3, 3, 90, 90]);
    battle.dispatch(play_turn());

    const state = battle.state;

    expect(state.bogeys.enkidu.weaponry.firecons[0]).toMatchObject({ id: 0, target_id: 'siduri' });

    const enkidu = get_bogey(state, 'enkidu');
    const siduri = get_bogey(state, 'siduri');

    expect(enkidu.weaponry.weapons[1]).toHaveProperty('firecon_id', 0);
    expect(siduri).not.toHaveProperty('weaponry.weapons.0');

    // writeFileSync('./battle.json', JSON.stringify(log, undefined, 2));

    const this_turn = state.log.slice(fp.findLastIndex({ type: play_turn.type })(state.log));

    // shoots fired!
    expect(_.filter(this_turn, { type: weapons_firing_phase.type })).toHaveLength(1);

    // // ouch, ouch, ouch
    // expect( _.find( log, { type: 'DAMAGE' } ) ).toBeTruthy();
    // let damage_actions = _.filter( log, { type: 'DAMAGE' } );
    // expect( damage_actions ).toEqual(
    //   expect.arrayContaining([expect.objectContaining({
    //       type: 'DAMAGE',
    //       payload: expect.objectContaining({
    //           dice: [3],
    //       })
    //   })
    //   ]));
    // // we haz shields?
    // expect( siduri.structure.shields ).toEqual([
    //     { id: 0, level: 1},
    //     { id: 1, level: 2 }
    // ]);
    // // let p = new Promise( () => { } ); await p;
    // // console.log(log);
    // let internal_damage_actions = _.filter( log, { type: 'INTERNAL_DAMAGE' } );
    // expect( internal_damage_actions ).not.toHaveLength(0);
    // expect( siduri )
    //     .toMatchObject({
    //         structure: {
    //             hull: { current: 3, rating: 4 },
    //             armor: { current: 3, rating: 4 },
    //         },
    //         drive: {
    //             current: 3,
    //             damage_level: 1,
    //             rating: 6,
    //         },
    //     });
    // // // only siduri gets damage
    // // expect( enkidu().structure )
    // //     .toMatchObject({
    // //         hull: { current: 4},
    // //         armor: { current: 4},
    // //     });
    // // return battle;
    // return battle;
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
