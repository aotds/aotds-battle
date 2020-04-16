import Updux from 'updux';

type HullState = {
        current: number;
        rating: number;
        last_internal_check: number;
    };

type ArmorState = {
    rating: number;
    current: number;
}

type StructureState = {
   hull: HullState;
   armor: ArmorState;
   destroyed: boolean
}

const dux = new Updux({
    initial: {
        destroyed: false,
        hull: inflateHull(0),
        armor: inflateArmor(),
    } as StructureState,
});

export default dux.asDux;

type StructureShorthand = {
    hull: number | HullState;
    armor?: number | ArmorState;
    destroyed?: boolean;
}

function inflateHull( shorthand: HullState|number ): HullState {
    if( typeof shorthand === 'number' ) {
        return {
            current: shorthand,
            rating: shorthand,
            last_internal_check: shorthand,
        }
    }

    return shorthand;
}

function inflateArmor(shorthand?: number | ArmorState ) : ArmorState {
    if( !shorthand ) shorthand = 0;

    if( typeof shorthand === 'number' ) {
        return {
            current: shorthand,
            rating: shorthand,
        }
    }

    return shorthand;
}

export function inflateStructure(shorthand: StructureShorthand): StructureState {

    return {
        destroyed: shorthand.destroyed ?? false,
        hull: inflateHull(shorthand.hull),
        armor: inflateArmor(shorthand.armor),
    }

}
