import { add_timestamp, add_action_id, add_parent_action } from './meta';
import validate_schema from './validate_schema';
import play_turn from './play_turn';

import weapons_mw from './weapons';
import movement_mw from './movement';

// players
//Check all ships
//ships with orders not done
//filter those not associated with players
//filter those not associated with active players
//make sure there are at least 2 active players 
//if 
const debug = require('debug')('aotds:mw');


const trycatch = ({getState}) => next => action => {
    let state = getState();
    try {
        next(action);
    }
    catch(e) {
        debug(action);
        debug(state);
        throw e;
    }
};

export default [
    add_timestamp,
    add_action_id,
    add_parent_action,
    validate_schema,
    play_turn,
    ...weapons_mw,
    ...movement_mw,
    trycatch,
];
