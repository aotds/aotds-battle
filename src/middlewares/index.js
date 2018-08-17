import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import Actions from '../actions';

import { add_timestamp, add_action_id, add_parent_action } from './meta';

import { get_object_by_id, players_not_done, active_players } from './selectors';

import { mw_for } from './utils';

const debug = require("debug")("aotds:mw");

import validate_schema from './validate_schema';

// players
//Check all ships
//ships with orders not done
//filter those not associated with players
//filter those not associated with active players
//make sure there are at least 2 active players 
//if 

import createSagaMiddleware from 'redux-saga';
import sagas from './sagas';

const thaw = () => next => action => {
    let clone = _.cloneDeep(action);
    clone.potato = 1;
    console.log(clone);
    next(clone);
}

import weapons_mw from './weapons';

export default [
    add_timestamp,
    add_action_id,
    add_parent_action,
    validate_schema,
    ...weapons_mw,
];
