import actions from '../actions';
import fp from 'lodash/fp';
import u from 'updeep';
import Duration from 'duration-js';

const debug = require('debug')('aotds:reducer:game');

import { actions_reducer } from './utils';

let redact  = {};

redact.INIT_GAME = ({game}) =>
    u( fp.pick(['name', 'players'])(game) );

redact.PLAY_TURN = ({timestamp}) => state =>  u({ turn_times: 
    u.if( fp.has( 'max' ), t => {
        let started = Date.parse(t.started);
        debug(started);
        let max = new Duration(t.max);
        let later = new Date(started + max);
        return { ...t, deadline: later.toISOString() };
    })})( u( { 
    turn: t => t+1,
    turn_times: { 
        started: timestamp,
    },
})(state) );

const original_state = {
    turn: 0,
};

export default actions_reducer( redact, original_state );

