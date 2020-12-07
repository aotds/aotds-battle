import {
    Shields_Shorthand,
    Shields_State
} from './types';

export default function inflate_shields(shorthand: Shields_Shorthand = []): Shields_State {
    let id = 0;

    return shorthand.map(shield => {
        id++;
        if (typeof shield === 'object') return { ...shield, id };
        return { id, level: shield };
    });
}
