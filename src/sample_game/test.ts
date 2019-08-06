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

expect.addSnapshotSerializer({
    test: () => true,
    print: val => JSON.stringify(val, null, 2),
});

type TurnDirective = {
    actions: Action[];
    dice: number[][];
    tests: (state: BattleState) => void;
    end_state?: BattleState;
};

let turns: TurnDirective[] = [];

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

turns[0] = {
    actions: [],
    dice: [],
    tests(state) {
        expect(state).toMatchObject({});
    },
};

turns[1] = {
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
    dice: [],
    tests(state) {
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
    },
};

turns[2] = require('./turn-2');

type TestFunc = (battle: BattleState) => void;
const turn_tests: TestFunc[] = [];

function pretty_log(log: LogState) {
    return log.map(({ type, payload }: any) => ({ [type]: payload }));
}

// turn 3, we stop and fire like mad
turns[3] = {
    actions: [
        ...['enkidu', 'siduri'].map(bogey_id => set_orders(bogey_id, { navigation: { thrust: -1 } })),
        play_turn(),
    ],
    dice: [[4, 1], []],
    tests(state) {
        const { enkidu, siduri } = state.bogeys;

        [enkidu, siduri].forEach(ship => expect(ship).toHaveProperty('navigation.velocity', 0));

        expect(siduri).toMatchObject({
            drive: {
                damage_level: 1,
                current: 3,
            },
            navigation: {
                thrust_used: 1,
            },
        });
    },
};

turns[4] = {
    actions: [play_turn()],
    dice: [[6, 1], [6, 1], [5], [90], [90]],
    tests(state) {
        const { siduri, enkidu } = state.bogeys;

        expect(siduri.structure).toMatchObject({
            hull: { current: 2, rating: 4 },
            armor: { current: 2, rating: 4 },
        });

        expect(siduri.drive).toMatchObject({
            damage_level: 2,
            current: 0,
        });
    },
};

turns[5] = {
    actions: [play_turn()],
    dice: [[5, 3], [], [90], [90]],
    tests(state) {
        const { siduri } = state.bogeys;
        debug(pretty_log(state.log));
        expect(siduri.structure).toMatchObject({
            hull: { current: 2, rating: 4 },
            armor: { current: 1, rating: 4 },
        });
    },
};

turns[6] = {
    actions: [play_turn()],
    dice: [[5, 6], [2], [90], [90]],
    tests(state) {
        const { siduri } = state.bogeys;

        expect(siduri.structure).toMatchObject({
            hull: { current: 1 },
            armor: { current: 0 },
        });
    },
};

turns[7] = {
    actions: [play_turn()],
    dice: [[5, 2], [], [90], [90], [90]],
    tests(state) {
        const { siduri } = state.bogeys;

        expect(siduri.structure).toMatchObject({
            hull: { current: 0 },
            armor: { current: 0 },
            destroyed: true,
        });
    },
};

turns[8] = {
    actions: [play_turn()],
    dice: [],
    tests(state) {
        const { siduri } = state.bogeys;
        expect(state.bogeys).not.toHaveProperty('siduri');
        expect(state.bogeys).toHaveProperty('enkidu');
    },
};

const battle = new Battle({ name: 'gemini' });
//devtools: {
// suppressConnectErrors: false,
// wsEngine: 'uws',
//},
let i = 0;
const manage_turn = function(battle: Battle, directives: TurnDirective) {
    dice.default.mockReset();

    dice.default.mockImplementation((...args: any) => {
        throw new Error('roll dice needs mocking: ' + JSON.stringify(args));
    });

    _.get(directives, 'dice', []).forEach((result: any) => dice.default.mockImplementationOnce(() => result));

    directives.actions.forEach(a => battle.dispatch(a));

    directives.end_state = _.cloneDeep(battle.state);
};

turns = turns.splice(0, 3);
turns.forEach(turn => manage_turn(battle, turn));

function scrub_log(log: LogState) {
    return u.map(
        {
            meta: u.omitted,
            subactions: u.if(_.identity, scrub_log),
        },
        log,
    );
}

function snapshot_scrub(state: BattleState) {
    return u({ log: scrub_log }, state);
}
describe.each(turns.map((t, i) => [i, t]))('turns', function(i: any, turn: any) {
    test('turn ' + i, function() {
        turn.tests(turn.end_state);
        expect(snapshot_scrub(turn.end_state)).toMatchSnapshot('turn_' + i);
    });
});
