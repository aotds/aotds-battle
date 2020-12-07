import _ from 'lodash';

import { Firecons_State, Firecons_Shorthand } from './types';

export default function inflate_firecons(shorthand: Firecons_Shorthand = 0): Firecons_State {
    if (Array.isArray(shorthand)) return shorthand;

    return _.range(1, shorthand + 1).map(id => ({ id }));
}
