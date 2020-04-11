import { WeaponMounted } from '../..';
import {relativeCoords} from './relativeCoords';
import _ from 'lodash';
import inArcs from './inArcs';
import {rollDice} from '../../../../../../../dice';
import {NavigationState} from '../../../../navigation';

type Aborted = {
    aborted: true,
    reason: 'no firing arc' | 'aft weapon while thrusting' | 'out of range',
    bearing: number;
    distance: number;
}

type Success = {
    damage_dice: number[],
    penetrating_damage_dice: number[],
    bearing: number;
    distance: number;
};

type FireWeaponOutcome = Aborted | Success;

export function fireWeapon(attacker: NavigationState, target: NavigationState, weapon: WeaponMounted): FireWeaponOutcome {
    // right now it's all beam weapons
    const { distance, bearing } = relativeCoords(attacker, target);

    if (inArcs(['A'], bearing) && attacker.thrust_used ) {
        // aft weapons can't be used when thrusting
        return { aborted: true, reason: 'aft weapon while thrusting', distance, bearing };
    }

    if (!inArcs(weapon.arcs, bearing)) {
        return {aborted: true, reason: 'no firing arc', distance, bearing};
    }

    const nbr_dice = weapon.weapon_class - (Math as any).trunc(distance / 12);

    if (nbr_dice <= 0) {
        return {
            aborted: true,
            reason: 'out of range',distance, bearing
        }
    }

    let damage_dice = rollDice(nbr_dice, { note: 'fire_weapon' });

    const nbr_penetrating_dice = damage_dice.filter(d => d === 6).length;

    let penetrating_damage_dice = rollDice(nbr_penetrating_dice, { reroll: [6], note: 'fire_weapon penetrating damage' });

    // if the target gets it in Aft, all damages are penetrating
    if (inArcs(['A'], relativeCoords(target, attacker).bearing)) {
        penetrating_damage_dice = damage_dice.concat( ...penetrating_damage_dice );
        damage_dice = [];
    }

    return {
        damage_dice,
        penetrating_damage_dice,
        distance, bearing
    }
}
