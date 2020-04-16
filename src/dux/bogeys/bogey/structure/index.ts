import Updux from 'updux';
import {action,payload} from 'ts-action';
import fp from 'lodash/fp';
import u from 'updeep';

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

const bogey_damage = action(
    'bogey_damage',
    payload<{
        bogey_id: string;
        damage: number;
        is_penetrating?: boolean;
    }>(),
);

const dux = new Updux({
    initial: {
        destroyed: false,
        hull: inflateHull(0),
        armor: inflateArmor(),
    } as StructureState,
    actions: { bogey_damage },
    subduxes: {},
    coduxes: [],
});

dux.addMutation(dux.actions.bogey_damage, ({ damage, is_penetrating }) => ((structure: StructureState) => {
    if (!damage) return structure;

    let armor = structure.armor.current;

    const dec_current = (damage: number) => (v: number) => v - damage;

    if (!is_penetrating) {
        const armor_damage = Math.min(fp.ceil(damage / 2), armor);
        damage -= armor_damage;

        structure = u.updateIn( 'armor.current', dec_current(armor_damage), structure) as any;
    }

    structure = u.updateIn( 'hull.current', dec_current(damage), structure) as any;

    if( structure.hull.current <= 0 ) structure = u({ destroyed: true }, structure ) as any;

    return structure;

} )as any);

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
