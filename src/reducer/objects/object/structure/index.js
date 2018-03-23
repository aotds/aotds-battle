import u from 'updeep';
import fp from 'lodash/fp';

import { actions_reducer } from '../../../utils';
import Actions from '../../../../actions';

const debug = require('debug')('aotds:reducer:struct');

export function inflate_state(state) {
    let inflate_hull = x => typeof x === 'number' ? { current: x, max: x } : x;

    let i = 1;
    return u({ 
        hull: inflate_hull, 
        armor: inflate_hull,
        shields: u.map(
            u.if( s => typeof s === 'number', 
                s => ({ id: i++, level: s }) )
        ) 
    })(state);
}

export
let redact = {};

redact[Actions.DAMAGE] = ({ damage, penetrating }) => state => {
    if( !damage ) return state;

    let update;
    if( penetrating ) {
        update = u({ hull: { current: c => c - damage } })
    }
    else {
        let armor_damage = fp.min([ fp.ceil(damage/2), state.armor.current ]);
        update =  u({
            hull: { current: c => c - damage + armor_damage },
            armor: { current: c => c - armor_damage },
        })
    }

    return update(state);

};

const reducer = actions_reducer( redact, { hull: 0, armor: 0 } );

export default reducer;
