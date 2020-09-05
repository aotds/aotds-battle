import { fireWeapon } from '.';

import * as dice from '../../../../../../../dice';

let rigged = [{ returns: [6] }, { returns: [6, 1] }];

(dice as any).rollDice = (nbr: number, options = {}) => {
    const args = { nbr, ...options };
    let result = rigged.shift();
    if (!result) {
        throw new Error(`no rigged dice for ${JSON.stringify(args)}`);
    }
    return result.returns;
};

let attacker = { coords: [0, 0], heading: 0, velocity: 0 };
let target = { coords: [10, 1], heading: 6, velocity: 0 };

let result = fireWeapon(attacker as any, target as any, { weapon_type: 'beam', weapon_class: 1, arcs: ['FS'] });

test('basic', () => {
    expect(result).toMatchObject({
        damage_dice: [6],
        penetrating_damage_dice: [6, 1],
    });
});
