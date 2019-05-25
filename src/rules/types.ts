export type FireWeaponOutcome = Partial<{
    distance: number,
    bearing: number,
    aborted: boolean,
    no_firing_arc: boolean,
    out_of_range: boolean,
    damage_dice: number[],
    penetrating_damage_dice: number[],
}>;
