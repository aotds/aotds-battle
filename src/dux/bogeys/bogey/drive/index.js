import { Updux } from 'updux';
import fp from 'lodash/fp.js';

// type DriveState = {
//     rating: number;
//     current: number;
//     damage_level?: 0 | 1 | 2;
// };

export const dux = new Updux({
    initial: {
        rating: 0,
        current: 0,
    },
});

//type DriveShorthand = number | DriveState;

export function inflate(shorthand = 0) {
    if (typeof shorthand === 'number')
        return {
            current: shorthand,
            rating: shorthand,
            damageLevel: 0,
        };

    return fp.defaults({ damage_level: 0 }, shorthand);
}

