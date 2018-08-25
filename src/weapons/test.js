import { fire_weapon, relative_coords } from './index';
import { rig_dice, cheatmode } from '../dice';
import u from 'updeep';
import fp from 'lodash/fp';

cheatmode();

const debug = require('debug')('aotds:weapons');

describe( 'relative_coords', () => {
    let attacker = { navigation: { coords: [0,0], heading: 1 }, };
    let target   = { navigation: { coords: [ 0, 10 ], heading: 5 } };

    [
        { coords: [ 0, 10 ],  e: { angle: 0, bearing: -1, target_angle: 6, target_bearing: 1 } },
        { coords: [ 0, -10 ], e: { angle: 6, bearing: 5, target_angle: 0, target_bearing: -5  } },
        { coords: [ 10, 0 ],  e: { angle: 3, bearing: 2, target_angle: -3, target_bearing: 4  } },
    ]
        .forEach( ({ coords, e }) => {
            test( JSON.stringify(coords), () => {
            expect( relative_coords(attacker, u.updateIn('navigation.coords', coords )(target) ) ).toMatchObject(e);
            })
    });
});

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


describe( 'target bearing',  () => {

    let attacker = { navigation: { coords: [0,0], heading: 0 }, };
    let target   = { navigation: { coords: [ 0, 10 ], heading: 0 } };
    let weapon   = { type: 'beam', class: 2, arcs: [ 'F' ] };


    fp.times(Number)(12).forEach( heading => test( `heading ${heading}`, () => {
        rig_dice( fp.times( fp.constant(1) )(6) );

        let result = fire_weapon( 
            attacker, 
            u.updateIn( 'navigation.heading', heading )(target),
            weapon 
        );

        let type = ( [0,1,11].some( x => heading === x ) ) ? 'penetrating_damage_dice' : 'damage_dice';

        expect(result).toMatchObject({
            [type]: [1,1],
        });
    }));

});

describe( "aft", () => {

    rig_dice([1,1]);

    let attacker = { navigation: { coords: [0,0], heading: 6 }, 
        drive: { },
    };
    let target   = { navigation: { coords: [ 0, 10 ], heading: 6 } };
    let weapon   = { type: 'beam', class: 2, arcs: [ 'A' ] };

    test( 'no thrust used? fire away', () => {

        let result = fire_weapon(attacker,target,weapon);

        expect(result).toMatchObject({ damage_dice: [1,1] });
    });

    test( 'thrust used? no fire', () => {

        let result = fire_weapon(u.updateIn('drive.thrust_used',2
        )(attacker),target,weapon);

        expect(result).toHaveProperty('drive_interference',true);
        expect(result).not.toHaveProperty('damage_dice');
    });

});

test('no target', () => {
    let result = fire_weapon({},null,{});

    expect( result ).toHaveProperty( 'aborted' );
});

test('no weapon', () => {
    let result = fire_weapon({},{},null);

    expect( result ).toHaveProperty( 'aborted' );
});


