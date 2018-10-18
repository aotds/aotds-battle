import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { actions, types } from '~/actions';
import { get_bogeys } from '../selectors';

import { roll_die } from '~/dice';

import { subactions, mw_for } from '../utils';

const cap_sum = max => x =>  Math.max( 0, Math.min(x, x + (max -= x))) 

export
function ship_damage_control(bogey) {
   let parties = _.get( bogey, 'damage_control_parties.current', 0 );

    // ensure we don't bust our max 
    return bogey |> fp.getOr([])('orders.damage_control_parties')
        |> fp.uniqBy( o => _.values(_.pick(o,[ 'system', 'system_id' ])).join(':') )
        |> u.map( u({ parties:  _.min([parties,3]) } ) )
        |> u.map( u({ parties: cap_sum(parties) } ) )
        |> u.map( ({ parties, system, system_id }) => actions.damage_control( bogey.id, parties, system, system_id ) );
}

export const damage_control_phase = function({getState,dispatch},next,action) {
    let bogeys = getState() |> get_bogeys;
    bogeys.map( ship_damage_control ).map( action => dispatch(action) );
} |> _.curry |> subactions |> mw_for( types.DAMAGE_CONTROL_PHASE );

export const damage_control = function(store,next,action) {
    let { parties } = action;
    let die = roll_die();

    return action 
        |> u({ dice: [ die ], repaired: die <= Math.min( 3, parties ) })
        |> next;

} |> _.curry |> mw_for(types.DAMAGE_CONTROL);


