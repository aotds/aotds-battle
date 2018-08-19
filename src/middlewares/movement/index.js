import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { MOVEMENT_PHASE, BOGEY_MOVEMENT, actions } from '~/actions';
import { plot_movement } from '~/movement';

import { get_bogey, get_bogeys, select } from '../selectors';
import { mw_for, subactions } from '../utils';

export const movement_phase = function({getState,dispatch},next,action){
    return getState() 
        |> select( get_bogeys )
        |> fp.filter('navigation')
        |> fp.map( bogey => actions.bogey_movement(bogey.id) )
        |> fp.map( dispatch );
} |> _.curry |> subactions |> mw_for( MOVEMENT_PHASE );

export const bogey_movement = function({getState,dispatch},next,action){
    let bogey = getState() |> select(get_bogey, action.bogey_id);

    next(u({ navigation: u.constant(plot_movement(bogey)) })(action));

} |> _.curry |> mw_for( BOGEY_MOVEMENT );

export default [
    movement_phase,
    bogey_movement,
];
