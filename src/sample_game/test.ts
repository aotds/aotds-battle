import _ from 'lodash';
import { applyMiddleware, compose } from 'redux';
import devToolsEnhancer, { composeWithDevTools } from 'remote-redux-devtools';

import battle_dux from '../dux';

jest.mock('../dice');
import * as dice from '../dice';

const composeEnhancers = composeWithDevTools({
    realtime: true,
    port: 8000,
    maxAge: 3000,
    actionsBlacklist: ['inc_action_id'],
});

const battle = battle_dux.createStore(undefined, mws => {
    if (process.env.REDUX_DEBUG) return composeEnhancers(applyMiddleware(mws));

    return applyMiddleware(mws);
});

let rigged_dice = [];
dice.rollDice.mockImplementation((...args: any[]) => {
    if (!rigged_dice.length) {
        throw new Error(`no dice left for ${JSON.stringify(args)}`);
    }

    const index = fp.findIndex((d: any) => {
        if (d.length === 1) return true;
        return fp.matches(d[0], {
            dice: args[0],
            ...args[1],
        });
    })(rigged_dice);

    if (index === -1) {
        throw new Error(`no dice found for ${JSON.stringify(args)}`);
    }

    const [result] = rigged_dice.splice(index, 1);
    return _.last(result);
});

const playRound = battle => round => {
    const turn = require(`./turn-${round}`);

    //    rigged_dice = turn.dice ?? [];

    (turn.actions ?? []).forEach(battle.dispatch);

    //const state = groomState(battle.getState());
    const state = battle.getState();

    turn.tests(state);

    // tap.test(`turn ${round}`, { skip: process.env.TURN && process.env.TURN !== round } as any, async t => {
    //     turn.tests(state)(t);

    //     t.cleanSnapshot = s =>
    //         s.replace(/"timestamp": ".*?",/g, '"timestamp": "",').replace(/"done": "20.*?"/g, '"done": true');

    //     if( ! process.env.SKIP_SNAPSHOT ) t.matchSnapshot(state, 'state');
    // });

    return;
};

test.each([0, 1])('round %#', playRound(battle));
