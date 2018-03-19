import { fire_weapon } from './index';
import { rig_dice } from '../dice';

const debug = require('debug')('aotds:weapons');

test( 'basic',  () => {

    let attacker = { navigation: { coords: [0,0], heading: 0 }, };
    let target   = { navigation: { coords: [ 10, 0 ], heading: 6 } };
    let weapon   = {};

    rig_dice([ 6, 6, 1 ]);
    let result = fire_weapon( attacker, target, { type: 'laser', class: 1, arcs: [ 'FS' ] } );

    expect(result).toMatchObject({
        damage_dice:             [6],
        penetrating_damage_dice: [6,1],
    });

    debug(result);

});
