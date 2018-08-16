import u from 'updeep';
import fp from 'lodash/fp';
import _ from 'lodash';

import { types } from '~/actions';
import { mapping_reducer, actions_reducer, redactor } from '~/reducer/utils';

import bogey from './bogey';
import inflate from './inflate';

const debug = require('debug')('aotds:bogeys');

const default_selector = action => fp.matchesProperty('id', action.object_id);
const only_target_object = ( selector = default_selector ) => action => {
    return u.map( 
        u.if( selector(action),
           obj => object_reducer( obj, action )
        )
    );
};

let redaction = redactor();

redaction.PLAY_TURN = action => u.omitBy( u.is('structure.destroyed',true) )

redaction.INTERNAL_DAMAGE = only_target_object();
redaction.DAMAGE = only_target_object();

redaction.INIT_GAME = action => () => (_.get(action,'bogeys',{}) |> inflate);

const specific_bogey = action => u.updateIn( action.bogey_id, b => bogey(b,action) );

[ 'SET_ORDERS', 'CLEAR_ORDERS',
    'EXECUTE_SHIP_FIRECON_ORDERS', 'ASSIGN_WEAPON_TO_FIRECON'
].forEach( action => redaction[action] = specific_bogey );

export default actions_reducer( redaction, {} );
    
