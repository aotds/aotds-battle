// @format

import _ from 'lodash';
import u from 'updeep';
import fp from 'lodash/fp';

import { WeaponState } from '../store/bogeys/bogey/weaponry/weapon/reducer';
import { BogeyState } from '../store/bogeys/bogey/types';
import { arc_ranges, Arc } from '../store/constants';
import roll_dice from '../dice';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';
import { oc } from 'ts-optchain';
import { FireWeaponOutcome } from './types';
import { ShieldState } from '../store/bogeys/bogey/structure/types';


type FWBogey = Pick<BogeyState, 'navigation' | 'drive'>;

function in_arcs(arcs: Arc[], angle: number) {
    return _.flatten(_.values(_.pick(arc_ranges, arcs))).some((arc: any) => angle >= arc[0] && angle <= arc[1]);
}
export function fire_weapon(
    attacker: FWBogey | undefined,
    target: FWBogey | undefined,
    weapon: WeaponState | undefined,
) {
    if (!attacker || !target || !weapon) {
        return {
            aborted: true,
        } as FireWeaponOutcome;
    }

    // right now it's all beam weapons

    let { distance, bearing } = relative_coords(attacker.navigation, target.navigation);

    if (in_arcs(['A'], bearing) && oc(attacker).navigation.thrust_used(0) > 0) {
        // aft weapons can't be used when thrusting
        return { aborted: true } as FireWeaponOutcome;
    }

    let outcome: FireWeaponOutcome = {
        distance,
        bearing,
    };

    if (!in_arcs(weapon.arcs, bearing)) {
        outcome.no_firing_arc = true;
        return outcome;
    }

    const nbr_dice = weapon.weapon_class - Math.trunc(distance / 12);

    if (nbr_dice <= 0) {
        outcome.out_of_range = true;
        return outcome;
    }

    outcome.damage_dice = roll_dice(nbr_dice, { note: 'fire_weapon' });

    const nbr_p_dice = outcome.damage_dice.filter(d => d === 6).length;

    outcome.penetrating_damage_dice = roll_dice(nbr_p_dice, { reroll: [6], note: 'fire_weapon penetrating damage' });

    // if the target gets it in Aft, all damages are penetrating
    if (in_arcs(['A'], relative_coords(target.navigation, attacker.navigation).bearing)) {
        outcome.penetrating_damage_dice = [...outcome.damage_dice, ...outcome.penetrating_damage_dice];

        outcome.damage_dice = [];
    }

    return outcome;
}

const beam_damage_table = { 4: 1, 5: 1, 6: 2 };

const beam_damage = (shield = 0) => (dice: number) => {
    let table = u({
        4: u.if(shield, 0),
        6: u.if(shield >= 2, 1),
    })(beam_damage_table);

    return table[dice] || 0;
};

export function weapon_damage(
    bogey: BogeyState,
    dice: number[],
    is_penetrating: boolean = false,
): {
    damage: number;
    is_penetrating: boolean;
} {
    // all is beams right now
    let bd = beam_damage(
        _.max(
            oc(bogey)
                .structure.shields([])
                .filter((s: ShieldState) => !s.damaged)
                .map(s => s.level),
        ),
    );

    let damage = _.sum(dice.map(d => bd(d)));

    return { damage, is_penetrating };
}
