import u from 'updeep';
import fp from 'lodash/fp';

import actions from '../../../actions';

import { actions_reducer, combine_reducers, pipe_reducers, init_reducer } from '../../utils';

let debug = require('debug')('aotds:battle:reducer:object:drive');

let reaction = {};

reaction.INTERNAL_DAMAGE = action => state => {
    if( action.system.type !== 'drive' ) return state;

    return fp.pipe([
        u({ damage_level: l => fp.isNil(l) ? 1 : l+1 }),
        u.if( ({damage_level}) => damage_level === 1, 
            s => ({ ...s, current: parseInt(s.rating/2)}) 
        ),
        u.if( ({damage_level}) => damage_level === 2, u({ current: 0 })  ),
    ])(state);

    return state;
};

export default pipe_reducers([
    init_reducer({}),
    actions_reducer(reaction),
]);
