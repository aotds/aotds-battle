import tap from 'tap';
import {fireWeapon} from '.';

import * as dice from '../../../../../../../dice';

let rigged: any = [
    {returns: [6]},
    {returns: [6, 1]},
];

(dice as any).rollDice = (nbr, options) => {
    const args = {nbr, ...options};
    let result = rigged.shift();
    if (!result) {
        throw new Error(`no rigged dice for ${JSON.stringify(args)}`);
    }
    return result.returns;
}

let attacker: any = {coords: [0, 0], heading: 0, velocity: 0};
let target: any = {coords: [10, 1], heading: 6, velocity: 0};

let result = fireWeapon(attacker, target, {weapon_type: 'beam', weapon_class: 1, arcs: ['FS']});

tap.match(result, {
    damage_dice: [6],
    penetrating_damage_dice: [6, 1],
});
