import _ from 'lodash';
import fp from 'lodash/fp';

import { WeaponState } from '../store/bogeys/bogey/weaponry/weapon/reducer';
import { BogeyState } from '../store/bogeys/bogey/types';
import { arc_ranges, Arc } from '../store/constants';
import roll_dice from '../dice';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';
import { oc } from 'ts-optchain';

export
function relative_coords(ship: NavigationState , target: NavigationState ) :{
        angle: number,
        bearing: number,
        distance: number,
}{
    let relative = _.zip
        .apply(null, [ship, target].map( fp.get('coords' )))
        .map((x: any) => x[1] - x[0]);

    let angle = Math.atan2(relative[0], relative[1])
        * 6 / Math.PI;

    let bearing = angle - ship.heading;

    let distance = Math.sqrt(relative.map(function (x) { return Math.pow(x, 2); })
        .reduce(function (a, b) { return a + b; }));

    return { angle, bearing, distance };
}

type FireWeaponOutcome = {
} & Partial<{
    distance: number,
    bearing: number,
    aborted: boolean,
    no_firing_arc: boolean,
    out_of_range: boolean,
    damage_dice: number[],
    penetrating_damage_dice: number[],
}>;

type FWBogey = Pick<BogeyState, 'navigation' | 'drive' >

function in_arcs( arcs: Arc[], angle: number ) {
    return _.flatten( _.values( _.pick( arc_ranges, arcs  ) ) ).some( (arc:any) =>
                                                       ( angle >= arc[0] ) && ( angle <= arc[1] )
                                                        );
}
export function fire_weapon(attacker: FWBogey|undefined, target: FWBogey|undefined, weapon: WeaponState|undefined) {

    if( !attacker || !target || !weapon ) {
        return {
            aborted: true
        } as FireWeaponOutcome
    }

    // right now it's all beam weapons

    let { distance, bearing } = relative_coords(attacker.navigation, target.navigation);

    if( in_arcs( ['A'], bearing ) && _.get( attacker, 'drive.thrust_used', 0 ) ) {
        // aft weapons can't be used when thrusting
        return { aborted: true } as FireWeaponOutcome;
    }

    let outcome :FireWeaponOutcome = {
        distance,
        bearing,
    };

    if( ! in_arcs( weapon.arcs, bearing ) ) {
        outcome.no_firing_arc = true;
        return outcome;
    }

    const nbr_dice = weapon.weapon_class - Math.trunc(distance / 12);

    if (nbr_dice <= 0) {
        outcome.out_of_range = true;
        return outcome;
    }

    outcome.damage_dice = roll_dice(nbr_dice);

    const nbr_p_dice = outcome.damage_dice.filter( d => d === 6 ).length;

    outcome.penetrating_damage_dice = roll_dice(
        nbr_p_dice, { reroll: [ 6 ] }
    );

    // if the target gets it in Aft, all damages are penetrating
    if( in_arcs( [ 'A' ], relative_coords( target.navigation, attacker.navigation ).bearing ) ) {
        outcome.penetrating_damage_dice = [
            ...outcome.damage_dice,
            ...outcome.penetrating_damage_dice
        ];

        outcome.damage_dice  = [];
    }

    return outcome;
}



//
//    var penetrating = roll_dice(dice.filter(function (d) { return d == 6; }).length, { reroll: [6] });
//
//    weapon_fired.dice = dice;
//
//    weapon_fired.dice_penetrating = penetrating;
//
//    yield weapon_fired;
//
//    // split the damage calculation apart?
//
//    var table = { 4: 1, 5: 1, 6: 2 };
//    var damage = _.sum(dice.map(function (d) { return table[d] || 0; }));
//    if (damage > 0) {
//        yield {
//            type: 'DAMAGE',
//            object_id: target.id,
//            damage
//        };
//    }
//    damage = _.sum(penetrating.map(function (d) { return table[d] || 0; }));
//    if (damage > 0) {
//        yield {
//            type: 'DAMAGE',
//            is_penetrating: true,
//            object_id: target.id,
//            damage
//        };
//    }
//}
