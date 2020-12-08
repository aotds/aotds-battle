import _ from 'lodash';

import { FireconsState, FireconsShorthand } from './types';

export default function inflate_firecons(shorthand: FireconsShorthand = 0): FireconsState {
    if (Array.isArray(shorthand)) return shorthand;

    return _.range(1, shorthand + 1).map(id => ({ id }));
}
