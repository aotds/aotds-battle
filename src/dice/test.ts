import roll_dice, { roll_die, rig_dice } from '.';

test( 'vegas, baby', () => {

    rig_dice([ 6, 5, 4 ] );

    expect( roll_dice( 2,{  reroll: [ 6 ] } ) ).toEqual([
        6, 5, 4
    ]);

    rig_dice([ 6, 5, 6, 3 ] );

    expect( roll_dice( 2,{  reroll: [ 6 ] } ) ).toEqual([
        6, 5, 6, 3
    ]);

    rig_dice(null);

});
