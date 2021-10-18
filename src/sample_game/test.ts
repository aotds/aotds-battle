import { range } from 'lodash';
import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'remote-redux-devtools';

import { dux } from '../dux';

const composeEnhancers = composeWithDevTools({
	realtime: true,
	port: 8000,
	maxAge: 3000,
	// actionsBlacklist: ['inc_action_id'],
});

const battle = dux.createStore(undefined, (middleware) => {
	if (process.env.REDUX_DEBUG)
		return composeEnhancers(applyMiddleware(middleware));

	return applyMiddleware(middleware);
});

const playTurn = (round) => {
	const turn = require(`./turn-${round}`);

	// rigged_dice = turn.dice ?? [];

	(turn.actions ?? []).forEach(battle.dispatch);

	const state = battle.getState();

	turn.tests(state);

	expect(state).toMatchSnapshot();
};

test.each(range(1))('turn %#', playTurn);

/*
import './groomState';

import battle_dux from '../dux';

jest.mock('../dice');
import * as dice from '../dice';

let rigged_dice = [];
dice.rollDice.mockImplementation((...args: any[]) => {
    if (!rigged_dice.length) {
        throw new Error(`no dice left for ${JSON.stringify(args)}`);
    }

    const index = fp.findIndex((d: any) => {
        if (Array.isArray(d)) return true;
        return fp.matches(d.match, {
            dice: args[0],
            ...args[1],
        });
    })(rigged_dice);

    if (index === -1) {
        throw new Error(`no dice found for ${JSON.stringify(args)}`);
    }

    const [result] = rigged_dice.splice(index, 1);

    return Array.isArray(result) ? result : result.dice;
});


*/
