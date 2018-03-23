import actions from '../actions';
import fp from 'lodash/fp';
import u from 'updeep';

const debug = require('debug')('aotds:reducer:game');

import { actions_reducer } from './utils';

let redact  = {};

redact.INIT_GAME = ({game}) =>
    u( fp.pick(['name', 'players'])(game) );

redact.PLAY_TURN = () => u( { turn: t => t+1 });

const original_state = {
    turn: 0,
};

export default actions_reducer( redact, original_state );

