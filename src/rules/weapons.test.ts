// @format

import { fire_weapon, relative_coords } from './weapons';
import u from 'updeep';
import fp from 'lodash/fp';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';
import { WeaponState } from '../store/bogeys/bogey/weaponry/weapon/reducer';
import { BogeyState } from '../store/bogeys/bogey/types';

jest.mock('../dice');
const dice = require('../dice');
dice.default = jest.fn().mockImplementation((...args) => {
    throw new Error(`dice roll needs to be faked ${JSON.stringify(args)}`);
});

describe('relative_coords', () => {
    let attacker = { coords: [0, 0], heading: 1 };
    let target = { coords: [0, 10], heading: 5 };

    [
        { coords: [0, 10], e: { angle: 0, bearing: -1 } },
        { coords: [0, -10], e: { angle: 6, bearing: 5 } },
        { coords: [10, 0], e: { angle: 3, bearing: 2 } },
    ].forEach(({ coords, e }) => {
        test(JSON.stringify(coords), () => {
            expect(relative_coords(attacker as any, u({ coords })(target))).toMatchObject(e);
        });
    });
});

test('basic', () => {
    let attacker = { navigation: { coords: [0, 0], heading: 0, velocity: 0 } } as BogeyState;
    let target = { navigation: { coords: [10, 1], heading: 6, velocity: 0 } } as BogeyState;
    let weapon = {};

    dice.default.mockImplementationOnce(() => [6]);
    dice.default.mockImplementationOnce(() => [6, 1]);

    let result = fire_weapon(attacker, target, { weapon_type: 'beam', weapon_class: 1, arcs: ['FS'] } as WeaponState);

    expect(result).toMatchObject({
        damage_dice: [6],
        penetrating_damage_dice: [6, 1],
    });
});

test('bug w/ Front', () => {
    let attacker = { navigation: { coords: [0, 0], heading: 0 } } as any;
    let target = { navigation: { coords: [1, 10], heading: 6 } } as any;
    let weapon = {};

    dice.default.mockImplementationOnce(() => [6]);
    dice.default.mockImplementationOnce(() => [6, 1]);

    let result = fire_weapon(attacker, target, { weapon_type: 'beam', weapon_class: 1, arcs: ['F'] } as WeaponState);

    expect(result).toMatchObject({
        damage_dice: [6],
        penetrating_damage_dice: [6, 1],
    });
});

test('beam-2', () => {
    let attacker = { navigation: { coords: [0, 0], heading: 0 } } as any;
    let target = { navigation: { coords: [0, 10], heading: 6 } } as any;
    let weapon = {};

    dice.default.mockImplementationOnce(() => [6, 6]);
    dice.default.mockImplementationOnce(() => [1, 6, 2]);

    let result = fire_weapon(attacker, target, { weapon_type: 'beam', weapon_class: 2, arcs: ['F'] } as any);

    expect(result).toMatchObject({
        damage_dice: [6, 6],
        penetrating_damage_dice: [1, 6, 2],
    });
});

describe('target bearing', () => {
    let attacker: any = { navigation: { coords: [0, 0], heading: 0 } };
    let target: any = { navigation: { coords: [0, 10], heading: 0 } };
    let weapon: any = { weapon_type: 'beam', weapon_class: 2, arcs: ['F'] };

    fp.times(Number)(12).forEach(heading =>
        test(`heading ${heading}`, () => {
            dice.default.mockImplementationOnce(() => [1, 1]);
            dice.default.mockImplementationOnce(() => []);

            let result = fire_weapon(attacker, u.updateIn('navigation.heading', heading)(target), weapon);

            let type = [0, 1, 11].some(x => heading === x) ? 'penetrating_damage_dice' : 'damage_dice';

            expect(result).toMatchObject({
                [type]: [1, 1],
            });
        }),
    );
});

describe('aft', () => {
    let attacker = { navigation: { coords: [0, 0], heading: 6 }, drive: {} } as any;
    let target = { navigation: { coords: [0, 10], heading: 6 } } as any;
    let weapon = { weapon_type: 'beam', weapon_class: 2, arcs: ['A'] } as any;

    test('no thrust used? fire away', () => {
        dice.default.mockImplementationOnce(() => [1, 1]);
        dice.default.mockImplementationOnce(() => []);
        let result = fire_weapon(attacker, target, weapon);

        expect(result).toMatchObject({ damage_dice: [1, 1] });
    });

    test('thrust used? no fire', () => {
        let result = fire_weapon(u.updateIn('drive.thrust_used', 2)(attacker), target, weapon);

        expect(result).toHaveProperty('aborted');
        expect(result).not.toHaveProperty('damage_dice');
    });
});

test('no target', () => {
    let result = fire_weapon({} as any, undefined as any, {} as any);

    expect(result).toHaveProperty('aborted');
});

test('no weapon', () => {
    let result = fire_weapon({} as any, {} as any, undefined as any);

    expect(result).toHaveProperty('aborted');
});
