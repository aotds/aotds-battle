import tap from 'tap';
import _ from 'lodash';

import { weapon_fire } from './weapons';
import { rig_dice } from './dice';

import logger from '../Logger';

let attacker = {
    "id" : "enkidu",
    "name" : "Enkidu",
    "drive_rating": 5,
    "heading": 0,
    "coords" : [ 0, 0 ],
    "firecons" : [ { "id" : 0, target_id: 'siduri' } ],
         "weapons" : [
{
   "arcs" : [
      "F"
   ],
   "class" : 1,
   "id" : 0,
   "type" : "beam", "firecon": 0
}
         ]
      };

let target = {
         "coords" : [
            0,
            10
         ],
         "firecons" : [
            {
               "id" : 0
            }
         ],
         "id" : "siduri",
         "name" : "Siduri",
         "hull": 12,
         "max_hull": 12,
          "heading": 0,
         "weapons" : [
            {
               "id" : 0
            }
         ]
      };


tap.test( 'basic stuff', { autoend: true }, tap => {
    rig_dice( 6, 6, 4 );

    let result = weapon_fire( attacker, target, attacker.weapons[0] );

    tap.ok(
        _.findIndex( result, { type: 'DAMAGE', damage: 2 } ) > -1,
        'normal damage' 
    );

    tap.ok(
        _.findIndex( result, { type: 'DAMAGE', is_penetrating:  true, damage: 3 } ) > -1,
        'penetrating damage' 
    );

} );



