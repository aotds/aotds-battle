import _ from 'lodash';
import fp from 'lodash/fp';

import { MOVEMENT_PHASE, bogey_movement } from '~/actions';
import { plot_movement } from '~/movement';

import { get_bogeys, select } from '../selectors';
import { mw_for, subactions } from '../utils';

export const movement_phase = function({getState,dispatch},next,action){
    return getState() 
        |> select( get_bogeys )
        |> fp.filter('navigation')
        |> fp.map( bogey => bogey_movement(bogey.id) )
        |> fp.map( dispatch );
} |> _.curry |> subactions |> mw_for( MOVEMENT_PHASE );

export default [
    movement_phase
];
