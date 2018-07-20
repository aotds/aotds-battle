'use strict';

var _dice = require('./dice.js');

test('vegas, baby', () => {

    (0, _dice.rig_dice)([6, 5, 4, 3]);

    expect((0, _dice.roll_dice)(2, { reroll: [6] })).toEqual([6, 5, 4]);

    (0, _dice.rig_dice)([6, 5, 6, 3, 2]);

    expect((0, _dice.roll_dice)(2, { reroll: [6] })).toEqual([6, 5, 6, 3]);
});