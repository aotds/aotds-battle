import { rollDice } from '.';
import _ from 'lodash';

let rigged_dice: number[] = [];

_.random = () => (rigged_dice as any).shift();

rigged_dice = [6, 5, 4];

test('basic', () => {
    expect(rollDice(2, { reroll: [6] })).toEqual([6, 5, 4]);

    rigged_dice = [6, 5, 6, 3];

    expect(rollDice(2, { reroll: [6] })).toEqual([6, 5, 6, 3]);
});

test('nbr_faces', () => {
    const original = _.random;
    _.random = ((_one: any, n: number) => n) as any;

    expect(rollDice(1, { nbr_faces: 99 })).toEqual([99]);

    _.random = original;
});
