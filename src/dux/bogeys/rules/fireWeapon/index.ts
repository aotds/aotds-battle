type AbortReasons =
    | 'no firing arc'
    | 'aft weapon while thrusting'
    | 'out of range';

type Aborted = {
    aborted: AbortReasons;
};

export type FireWeaponOutcome = {
    bearing: number;
    distance: number;
    damage_dice: number[];
    penetrating_damage_dice: number[];
} & Partial<Aborted>;

type NavigationState = {};
type WeaponMounted = {};

const abortGen = (distance: number, bearing: number) => (aborted: AbortReasons): FireWeaponOutcome => ({
    distance,
    bearing,
    aborted,
    damage_dice: [],
    penetrating_damage_dice: [],
});


export function fireWeapon(
    attacker: NavigationState,
    target: NavigationState,
    weapon: WeaponMounted,
): FireWeaponOutcome {
    // right now it's all beam weapons
    const { distance, bearing } = relativeCoords(attacker, target);

    const abort = abortGen(distance, bearing);

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

    const nbr_penetrating_dice = damage_dice.filter((d) => d === 6).length;

    let penetrating_damage_dice = rollDice(nbr_penetrating_dice, {
        reroll: [6],
        note: 'fire_weapon penetrating damage',
    });

    // if the target gets it in Aft, all damages are penetrating
    if (inArcs(['A'], relativeCoords(target, attacker).bearing)) {
        penetrating_damage_dice = damage_dice.concat(
            ...penetrating_damage_dice,
        );
        damage_dice = [];
    }

    return hit(damage_dice, penetrating_damage_dice);
}
