import { fire_weapon } from './index';
import { rig_dice } from '../dice';

const debug = require('debug')('aotds:weapons');

test( 'basic',  () => {

    let attacker = { navigation: { coords: [0,0], heading: 0 }, };
    let target   = { navigation: { coords: [ 10, 1 ], heading: 6 } };
    let weapon   = {};

    rig_dice([ 6, 6, 1 ]);
    let result = fire_weapon( attacker, target, { type: 'beam', class: 1, arcs: [ 'FS' ] } );

    expect(result).toMatchObject({
        damage_dice:             [6],
        penetrating_damage_dice: [6,1],
    });

});

test( 'bug w/ Front',  () => {

    let attacker = { navigation: { coords: [0,0], heading: 0 }, };
    let target   = { navigation: { coords: [ 1, 10 ], heading: 6 } };
    let weapon   = {};

    rig_dice([ 6, 6, 1 ]);
    let result = fire_weapon( attacker, target, { type: 'beam', class: 1, arcs: [ 'F' ] } );

    expect(result).toMatchObject({
        damage_dice:             [6],
        penetrating_damage_dice: [6,1],
    });

});

test( 'beam-2',  () => {

    let attacker = { navigation: { coords: [0,0], heading: 0 }, };
    let target   = { navigation: { coords: [ 0, 10 ], heading: 6 } };
    let weapon   = {};

    rig_dice([ 6, 6, 1, 6, 2 ]);
    let result = fire_weapon( attacker, target, { type: 'beam', class: 2, arcs: [ 'F' ] } );

    expect(result).toMatchObject({
        damage_dice:             [6,6],
        penetrating_damage_dice: [1,6,2],
    });

});
