import tap from 'tap';
import _ from 'lodash';
import Battle from '../dux';
import groomState from './groomState';

tap.pass('this is fine...');

const playRound = battle => round => {
    const turn = require(`./turn-${round}`);

    (turn.actions ?? []).forEach(battle.dispatch);

    const state = groomState(battle.getState());

    tap.test(`turn ${round}`, async(t) => {
        turn.tests(state)(t);

        t.cleanSnapshot =
            s => s.replace( /"timestamp": ".*?",/g, '"timestamp": "",' )
                .replace( /"done": "20.*?"/g, '"done": true' )
            ;

        t.matchSnapshot(state, 'state');
    });


    return battle;
};

const battle = Battle.createStore();

console.log(Battle.mutations);

_.range(2).forEach(playRound(battle));

/*
turns[0] = require('./turn-0');

turns[1] = require('./turn-1');

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

const battle = Battle.createStore();
//devtools: {
// suppressConnectErrors: false,
// wsEngine: 'uws',
//},
let i = 0;
const manage_turn = function(battle: any, directives: TurnDirective) {
    dice.default.mockReset();

    dice.default.mockImplementation((...args: any) => {
        throw new Error('roll dice needs mocking: ' + JSON.stringify(args));
    });

    _.get(directives, 'dice', []).forEach((result: any) => dice.default.mockImplementationOnce(() => result));

    directives.actions.forEach(a => battle.dispatch(a));

    directives.end_state = battle.getState();
};

turns = turns.slice(0, 2);
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
*/
