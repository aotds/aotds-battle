import { roll_dice, rig_dice } from './dice.js';

test( 'vegas, baby', () => {

    rig_dice([ 6, 5, 4, 3 ]);

    expect( roll_dice( 2,{  reroll: [ 6 ] } ) ).toEqual([
        6, 5, 4
    ]);

    rig_dice([ 6, 5, 6, 3, 2 ]);

    expect( roll_dice( 2,{  reroll: [ 6 ] } ) ).toEqual([
        6, 5, 6, 3
    ]);

});
