import actions from '../actions';
import _ from 'lodash';
import u from 'updeep';

const debug = require('debug')('aotds:reducer:game');

const original_state = {
    turn: 0,
};

export default function game(state=original_state,action) {

    switch( action.type ) {
        case actions.INIT_GAME:
            return u( _.pick(action.game, ['name']) )(state);

        default: return state;
    }

}
