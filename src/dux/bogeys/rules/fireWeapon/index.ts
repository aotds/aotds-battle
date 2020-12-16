import { relativeCoords } from './relativeCoords';
import inArcs from './inArcs';
import { rollDice } from '../../../../dice';
import { NavigationState } from '../../bogey/navigation';
import { WeaponMounted } from '../../bogey/weaponry/weapons/types';

type AbortReasons = 'no firing arc' | 'aft weapon while thrusting' | 'out of range';

type Aborted = {
    aborted: AbortReasons;
};

type FireWeaponOutcome = {
    bearing: number;
    distance: number;
    damage_dice: number[];
    penetrating_damage_dice: number[];
    aborted?: AbortReasons;
};

export function fire_weapon(
    attacker: NavigationState,
    target: NavigationState,
    weapon: WeaponMounted,
): FireWeaponOutcome {
    // right now it's all beam weapons
    const { distance, bearing } = relativeCoords(attacker, target);

    const abort = (aborted: AbortReasons) => ({
        distance,
        bearing,
        aborted,
        damage_dice: [],
        penetrating_damage_dice: [],
    });
    const hit = (damage_dice: number[], penetrating_damage_dice: number[]) => ({
        distance,
        bearing,
        damage_dice,
        penetrating_damage_dice,
    });

    if (inArcs(['A'], bearing) && attacker.thrust_used) {
        // aft weapons can't be used when thrusting
        return abort('aft weapon while thrusting');
    }

    if (!inArcs(weapon.arcs, bearing)) {
        return abort('no firing arc');
    }

    const nbr_dice = weapon.weapon_class - (Math as any).trunc(distance / 12);

    if (nbr_dice <= 0) {
        return {
            aborted: 'out of range',
            distance,
            bearing,
        };
    }

    let damage_dice = rollDice(nbr_dice, { note: 'fire_weapon' });

    const nbr_penetrating_dice = damage_dice.filter(d => d === 6).length;

    let penetrating_damage_dice = rollDice(nbr_penetrating_dice, {
        reroll: [6],
        note: 'fire_weapon penetrating damage',
    });

    // if the target gets it in Aft, all damages are penetrating
    if (inArcs(['A'], relativeCoords(target, attacker).bearing)) {
        penetrating_damage_dice = damage_dice.concat(...penetrating_damage_dice);
        damage_dice = [];
    }

    return hit(damage_dice, penetrating_damage_dice);
}
