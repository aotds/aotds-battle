import tap from 'tap';
import _ from 'lodash';

import { weapon_fire,  relative_coords } from "../lib/battle/weapons";
import { rig_dice } from "../lib/battle/dice";

let attacker = {
    id: 'enkidu',
    coords: [0, 0],
    heading: 0
};

let target = {
    id: 'siduri',
    coords: [0, 10],
    heading: 0
};

let weapon = {
    type: 'beam',
    class: 1,
    arcs: [ 'F' ],
};

tap.test( 'relative_coords, bearing', tap => {

    [ 0, 45 ].forEach( heading => {
        [
            [ [ 0, 10 ],  0 ],
            [ [ 0, -10 ], 180 ],
            [ [ -1, -10 ], -174 ],
            [ [ 10, 0 ], 90 ],
            [ [ -10, 0 ], -90 ],
        ].forEach( t => tap.match(
            relative_coords( { heading, coords: [ 0,0 ] }, { coords: t[0] } ), 
            { angle: t[1], bearing: t[1] - heading }  
        ) )
    });

    tap.end();
});

tap.test( 'simple beam', tap => {

    rig_dice( [ 6,5,4 ] );

    tap.match( weapon_fire(attacker, target, weapon), [{
        distance:    10,
        bearing:     0,
        attacker_id: 'enkidu',
        target_id:   'siduri',
        dice:             [ 6 ],
        dice_penetrating: [ 5 ],
    },
    { type: "DAMAGE", damage: 2 },
    { type: "PENETRATING_DAMAGE", damage: 1 },
    ], "short distance, one reroll");

    tap.match( weapon_fire(attacker, { ...target, coords: [ 0, 20 ] }, weapon), [{
        distance:    20,
        bearing:     0,
        attacker_id: 'enkidu',
        target_id:   'siduri',
        out_of_range: true
    },
    ], "out of range");

    tap.match( weapon_fire(attacker, { ...target, coords: [ 10, 0 ] }, weapon), [{
        distance:    10,
        bearing:     90,
        attacker_id: 'enkidu',
        target_id:   'siduri',
        no_firing_arc: true
    },
    ], "no fire arc");

    tap.end();
});

