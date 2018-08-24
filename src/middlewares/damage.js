import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { DAMAGE } from '~/actions';
import * as rules from '~/rules/damages';

import { get_bogey } from './selectors';
import { mw_for } from './utils';

export const calculate_damage = function({getState,dispatch},next,action) {
    let bogey = getState() |> get_bogey(action.bogey_id);

    next(
        u({ 
            damage: rules.calculate_damage({ bogey, ...action})
        }, action)
    )
} |> _.curry |> mw_for( DAMAGE );
