import { HullState, StructureState, ArmorState } from './types';

type StructureShorthand = {
    hull: number | HullState;
    armor?: number | ArmorState;
    destroyed?: boolean;
};

export function inflate_hull(shorthand: HullState | number): HullState {
    if (typeof shorthand === 'number') {
        return {
            current: shorthand,
            rating: shorthand,
        };
    }

    return shorthand;
}

export function inflate_armor(shorthand?: number | ArmorState): ArmorState {
    if (!shorthand) shorthand = 0;

    if (typeof shorthand === 'number') {
        return {
            current: shorthand,
            rating: shorthand,
        };
    }

    return shorthand;
}

export default function inflate_structure(shorthand?: StructureShorthand): StructureState {
    if (!shorthand) return inflate_structure({ hull: 0 });

    return {
        hull: inflate_hull(shorthand.hull),
        armor: inflate_armor(shorthand.armor),
    };
}
