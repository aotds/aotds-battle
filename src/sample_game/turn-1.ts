import Battle from '../dux';
import initial_state from './initial_state';
import fp from 'lodash/fp';
import roundDeep from '../utils/roundDeep';

const debug = require('debug')('aotds:sample');

const { init_game, set_orders, try_play_turn } = Battle.actions;
const { getBogey } = Battle.selectors;

export const actions = [
    init_game(initial_state),
    set_orders('enkidu', {
        navigation: { thrust: 1, turn: 1, bank: 1 },
    }),
    try_play_turn(),
    set_orders('siduri', {
        navigation: { thrust: 1 },
    }),
    try_play_turn(),
];

export const tests = state => t => {
    t.equal(state.game.name, 'gemini', 'game name updated');

    t.is(state.game.turn, 1, 'we are at turn 1');

    const turn = fp.findLast(
        {
            type: 'play_turn',
        },
        state.log,
    );

    debug( getBogey(state)('enkidu') );
    t.match(
        roundDeep(getBogey(state)('enkidu')?.navigation),
{
        heading: 1,
        velocity: 1,
        coords: [1.5, 0.87],
    }
    );

    t.match(
        roundDeep(getBogey(state)('siduri')?.navigation),
{
        heading: 6,
        velocity: 1,
        coords: [10, 9],
    }
    );

    debug(turn);
};
