import tap from 'tap';
import {rollDice} from '.';
import _ from 'lodash';

let rigged_dice: number[] = [];

_.random = () => (rigged_dice as any).shift();

rigged_dice = [6, 5, 4];

tap.match(rollDice(2, {reroll: [6]}), [
    6, 5, 4
]);

rigged_dice = [6, 5, 6, 3];

tap.match(rollDice(2, {reroll: [6]}), [
    6, 5, 6, 3
]);

tap.test( 'nbr_faces', async () => {
    const original = _.random;
    _.random = ((one,n) => n ) as any;

    tap.match( rollDice(1,{nbr_faces: 99}), [ 99 ], 'got 99' );

    _.random = original;
});
