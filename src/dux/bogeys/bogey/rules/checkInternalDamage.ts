import {BogeyState} from '..';
import fp from 'lodash/fp';
import {rollDice} from '../../../../dice';

function drive(bogey: BogeyState) {
    if( (bogey.drive.damage_level??0) >= 2 ) return;

    return { system: "drive" };
}

const undamagedIds = fp.flow([
    fp.filter(({damaged}) => !damaged ),
    fp.map('id'),
]) as (list: unknown[]) => number[];

const subSystem = (system: 'firecon'|'weapon'|'shield', subs: {id: number, damaged?: boolean}[] ) => undamagedIds(subs).map( system_id => ({ system, system_id}) );

const firecons = ( bogey: BogeyState ) => subSystem( 'firecon', bogey.weaponry.firecons );
const weapons = ( bogey: BogeyState ) => subSystem( 'weapon', bogey.weaponry.weapons );
const shields = ( bogey: BogeyState ) => subSystem( 'shield', bogey.weaponry.shields );

export default function checkInternalDamage(bogey: BogeyState, damage: number) {
    const threshold = 100 * damage / (bogey.structure.hull.rating || 1);

    return ([
        drive(bogey),
        firecons(bogey),
        weapons(bogey),
        shields(bogey),
    ] as any).flat().map( (system) => ({
        ...system,
        threshold,
        roll: fp.first(
            rollDice(1,{ nbr_faces: 100, note: `internal damage check ${JSON.stringify(system)}` })
        )
    })).map( system => ({
        ...system,
        hit: system.roll <= system.threshold
    }));
}
