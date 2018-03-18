import actions from '../actions';
import fp from 'lodash/fp';
import u from 'updeep';

const debug = require('debug')('aotds:reducer:game');

const original_state = {
    turn: 0,
};

let red  = {};

// action => state => new_state

red[actions.INIT_GAME] = ({game}) =>
    u( fp.pick(['name', 'players'])(game) );

red[actions.PLAY_TURN] = () => u( { turn: t => t+1 });

function create_reducer( redupieces, initial_state = {} ) {
    return function( state = initial_state, action ) {
        let red = redupieces[action.type];
        return red ? red(action)(state) : state;
    }
}

export default create_reducer( red, original_state );

