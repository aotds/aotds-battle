import _ from 'lodash';

import { FireconState, FireconsShorthand, FireconsState } from './types';

export function inflate(shorthand: FireconsShorthand = 0): FireconsState {
    if (typeof shorthand !== 'number') return shorthand;

    return Object.fromEntries(_.range(1, shorthand + 1).map(id => [id, { id }]));
}
