import { fire_weapon } from '.';

jest.mock('../../../../dice');
import * as dice from '../../../../dice';

dice.rollDice.mockReturnValueOnce([6]);
dice.rollDice.mockReturnValueOnce([6, 1]);

test('basic', () => {
    let attacker = { coords: [0, 0], heading: 0, velocity: 0 };
    let target = { coords: [10, 1], heading: 6, velocity: 0 };

    let result = fire_weapon(attacker as any, target as any, { weapon_type: 'beam', weapon_class: 1, arcs: ['FS'] });

    expect(result).toMatchObject({ damage_dice: [6], penetrating_damage_dice: [6, 1] });
});
