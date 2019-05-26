// @format

import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import Battle from '../battle/index';
import initial_state from './initial_state';
import { init_game, try_play_turn, play_turn, weapons_firing_phase, fire_weapon } from '../store/actions/phases';
import { Action, ActionCreator } from '../reducer/types';
import { set_orders } from '../store/bogeys/bogey/actions';
import { LogState, LogAction } from '../store/log/reducer/types';
import { get_bogey } from '../store/selectors';
import { isType } from 'ts-action';
import { fire_weapon_outcome, damage } from '../actions/bogey';
import { BattleState } from '../store/types';

jest.mock('../dice');
const dice = require('../dice');

dice.default = jest.fn().mockImplementation((...args) => {
    throw new Error('roll dice needs mocking: ' + JSON.stringify(args));
});

expect.addSnapshotSerializer({
    test: () => true,
    print: val => JSON.stringify(val, null, 2),
});

type TurnDirective = {
    actions: Action[];
    dice: number[][];
};

const turn_directives = [];

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

const manage_turn = function(battle: Battle, directives: TurnDirective) {
    _.get(directives, 'dice', []).forEach((result: any) => dice.default.mockImplementationOnce(() => result));

    directives.actions.forEach(a => battle.dispatch(a));

    return battle.state;
};

turn_directives[0] = {
    actions: [],
};

turn_directives[1] = {
    actions: [
        init_game(initial_state),
        set_orders('enkidu', {
            navigation: { thrust: 1, turn: 1, bank: 1 },
        }),
        try_play_turn(),
        set_orders('siduri', {
            navigation: { thrust: 1 },
        }),
        play_turn(),
    ],
};

turn_directives[2] = {
    actions: [
        set_orders('enkidu', {
            firecons: [{ target_id: 'siduri' }],
            weapons: [{ firecon_id: 0 }, { firecon_id: 0 }, { firecon_id: 0 }],
        }),
        play_turn(),
    ],
    dice: [[6, 5], [3]],
};

const battle = new Battle({});
//devtools: {
// suppressConnectErrors: false,
// wsEngine: 'uws',
//},

const turns = turn_directives.map((d: any) => manage_turn(battle, d));

type TestFunc = (battle: BattleState) => void;
const turn_tests: TestFunc[] = [];

turn_tests[0] = state => {
    expect(state).toMatchObject({});
};

turn_tests[1] = state => {
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

    expect(_.omit(state, ['log'])).toMatchSnapshot();

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

function pretty_log(log: LogState) {
    return log.map(({ type, payload }: any) => ({ [type]: payload }));
}

turn_tests[2] = state => {
    expect(state.bogeys.enkidu.weaponry.firecons[0]).toMatchObject({ id: 0, target_id: 'siduri' });

    const enkidu = get_bogey(state, 'enkidu');
    const siduri = get_bogey(state, 'siduri');

    expect(enkidu.weaponry.weapons[1]).toHaveProperty('firecon_id', 0);
    expect(siduri).not.toHaveProperty('weaponry.weapons.0');

    // writeFileSync('./battle.json', JSON.stringify(log, undefined, 2));

    const this_turn = state.log.slice(fp.findLastIndex({ type: play_turn.type })(state.log));

    // shoots fired!
    expect(_.filter(this_turn, { type: weapons_firing_phase.type })).toHaveLength(1);

    debug(pretty_log(this_turn));
    expect(_.filter(this_turn, { type: fire_weapon.type })).not.toHaveLength(0);
    expect(_.filter(this_turn, { type: fire_weapon_outcome.type })).not.toHaveLength(0);

    // ouch, ouch, ouch
    expect(_.filter(this_turn, { type: damage.type })).not.toHaveLength(0);

    // we haz shields?
    expect(siduri.structure.shields).toEqual([{ id: 0, level: 1 }, { id: 1, level: 2 }]);

    // the shields should absorb some of the damage
    expect(_.filter(this_turn, damage('siduri', 2))).not.toHaveLength(0);

    //let internal_damage_actions = _.filter( log, { type: 'INTERNAL_DAMAGE' } );
    //expect( internal_damage_actions ).not.toHaveLength(0);

    expect(siduri).toMatchObject({
        structure: {
            hull: { current: 3, rating: 4 },
            armor: { current: 3, rating: 4 },
        },
        drive: {
            // current: 3,
            // damage_level: 1,
            rating: 6,
        },
    });

    // only siduri gets damage
    expect(state.bogeys.enkidu.structure).toMatchObject({
        hull: { current: 4 },
        armor: { current: 4 },
    });
};

describe.each(turn_tests.map((t, i) => [i, t]))('turns', function(i: any, tests: any) {
    test('turn ' + i, function() {
        tests(turns[i]);
    });
});
