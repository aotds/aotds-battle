import actions from '../actions';
import fp from 'lodash/fp';
import u from 'updeep';
import _ from 'lodash';
import Duration from 'duration-js';

const debug = require('debug')('aotds:reducer:game');

import { actions_reducer } from './utils';

let redact  = {};

redact.INIT_GAME = ({game}) =>
    u( fp.pick(['name', 'players', 'turn_times'])(game) );

redact.PLAY_TURN = ({meta: { timestamp }}) => state => u({ turn_times: 
    u.ifElse( fp.has( 'max' ), t => {
        let started = Date.parse(t.started);
        debug(started);
        let max = new Duration(t.max);
        let later = new Date(started + max);
        return { ...t, deadline: later.toISOString() };
    }, u.omit(['deadline']))})( u( { 
    turn: t => t+1,
    turn_times: { 
        started: timestamp,
    },
})(state) );

redact.PUSH_ACTION_STACK = ({action_id}) => u.updateIn('action_stack',
    stack => [ action_id, ...stack ] );

redact.POP_ACTION_STACK = () => u.updateIn('action_stack', _.tail );

redact.INC_ACTION_ID = () => u.updateIn('next_action_id', i => i + 1 );

const original_state = {
    turn: 0,
    next_action_id: 1,
    action_stack: [],
};

export default actions_reducer( redact, original_state );

