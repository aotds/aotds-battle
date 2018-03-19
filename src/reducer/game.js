import actions from '../actions';
import fp from 'lodash/fp';
import u from 'updeep';

const debug = require('debug')('aotds:reducer:game');

let redact  = {};

redact.INIT_GAME = ({game}) =>
    u( fp.pick(['name', 'players'])(game) );

redact.PLAY_TURN = () => u( { turn: t => t+1 });

function redactor( redactions, initial_state = {} ) {
    return function( state = initial_state, action ) {
        let red = redactions[action.type];
        return red ? red(action)(state) : state;
    }
}

const original_state = {
    turn: 0,
};

export default redactor( redact, original_state );

