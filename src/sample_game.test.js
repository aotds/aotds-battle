import {toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import fp from 'lodash/fp';

import { get_bogey } from './middlewares/selectors';

expect.extend({toBeDeepCloseTo, toMatchCloseTo });

import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');
debug.inspectOpts.depth = 99;

import { cheatmode, rig_dice } from './dice';

import Battle from './index';

Date.prototype.toISOString = jest.fn( () => '2018-01-01' );

let turns = [ () => Promise.resolve( new Battle() ) ];

function wait_forever () {
    return new Promise((a,r) => {     });
}

turns[1] = (battle) => {

    const initial_state = require('./sample_game/initial_state').default;

    battle.dispatch_action( 'init_game', initial_state );

    expect(battle.state).toMatchObject({ 
        game: { name: 'gemini', turn: 0 },
        bogeys:{ enkidu: { name: 'Enkidu' },
            siduri: { name: 'Siduri' }, },
    });

    let enkidu_orders = { thrust: 1, turn: 1, bank: 1 };

    battle.dispatch_action( 'set_orders', 'enkidu', {
        navigation: enkidu_orders,
    } );

    battle.dispatch_action( 'play_turn' );
    
    // not yet...
    expect(battle.state).toHaveProperty( 'game.turn', 0 );

    battle.dispatch_action( 'set_orders', 'siduri', {
        navigation: { thrust: 1 },
    } );

    expect( battle.state.bogeys.enkidu.orders.navigation )
        .toMatchObject( enkidu_orders );

    // let's check the log
    expect( battle.state.log.map( l => l.type ).filter( t => !/@@/.test(t) ) ).toEqual([
        'INIT_GAME', 'SET_ORDERS', 'SET_ORDERS'
    ]);

    battle.dispatch_action('play_turn');

    expect(battle.state.game).toMatchObject({ turn: 1 });

    expect(battle.state).toMatchSnapshot();

    // orders cleared out 
    let still_with_orders = battle.state |> fp.get('bogeys')
        |> fp.values
        |> fp.filter('orders');

    expect(still_with_orders).toEqual([]);

    // Enkidu still have a drive section
    expect(battle.state.bogeys.enkidu).toHaveProperty(
        'drive.current'
    );

    const expect_close = val => val.map( v => x => expect(x).toBeCloseTo(v) );

    // ships have moved 
    expect( battle.state |> get_bogey('enkidu') |> fp.get('navigation') )
        .toMatchCloseTo({
            heading: 1,
            velocity: 1,
            coords: [ 1.5, 0.9  ],
        },1);

    expect( battle.state |> get_bogey('siduri') |> fp.get('navigation') )
        .toMatchCloseTo({
            heading: 6,
            velocity: 1,
            coords: [ 10, 9  ],
        },1);

        return battle;
};

turns[2] = function turn2(battle) {
    battle.dispatch_action( 'set_orders', 'enkidu', {
        firecons: { 1: { target_id: 'siduri' } }, 
        weapons: { 1: { firecon_id: 1 },
            2: { firecon_id: 1 }, 
            3: { firecon_id: 1 }, },
    });

    rig_dice([ 6, 5, 3, 3, 90, 90]);
    battle.dispatch_action( 'play_turn', true );

    expect( battle.state.bogeys.enkidu.weaponry.firecons[1] )
        .toMatchObject(
            { id: 1,  target_id: 'siduri' }
        );

    const enkidu = () => battle.state |> get_bogey('enkidu');
    const siduri = () => battle.state |> get_bogey('siduri');

    expect( enkidu() ).toHaveProperty( 'weaponry.weapons.1.firecon_id', 1 );

    let log = battle.state.log;
    log = log.splice( _.findLastIndex( log, { type: 'PLAY_TURN' } ) );

    expect( _.filter( log, { type: 'DAMAGE', bogey_id: 'siduri', penetrating: true, dice: [3] } ) ).toHaveLength(1);

    expect( siduri().structure.shields ).toMatchObject({
        1: { level: 1},
        2: { level: 2 }
    });

    expect( _.filter(log, { type: 'INTERNAL_DAMAGE' } ).length ).toBeGreaterThan(0)

    expect( siduri() )
        .toMatchObject({
            structure: {
                hull: { current: 3, max: 4 },
                armor: { current: 3, max: 4 },
            },
            drive: {
                current: 3,
                damage_level: 1,
                rating: 6,
            },
        });

    // only siduri gets damage
    expect( enkidu().structure )
        .toMatchObject({
            hull: { current: 4},
            armor: { current: 4},
        });

    return battle;
};

turns[3] = function turn3(battle) {
    // turn 3, we stop and fire like mad

    rig_dice([4,1]);

    [ 'enkidu', 'siduri' ].forEach( ship =>
        battle.dispatch_action( 'set_orders', ship, { navigation: { thrust: -1 }, } ) 
    );

    battle.play_turn(true);

    [ 'enkidu', 'siduri' ].forEach( ship => expect(
            get_object_by_id(battle.state,ship).navigation.velocity
        ).toEqual(0)
    );

    expect( get_object_by_id(battle.state,'siduri').drive )
        .toMatchObject({
            damage_level: 1,
            current: 3,
            thrust_used: 1,
        });

    return battle;
};

turns[4] = function turn4(battle) {

    // oh my, internal damages on the drive!
    rig_dice([6,1,6,1,5,90,90]);

    battle.play_turn(true);

    expect( get_object_by_id(battle.state,'siduri').structure )
        .toMatchObject({
            hull:  { current: 1, max: 4 },
            armor: { current: 2, max: 4 },
        });

    expect( get_object_by_id(battle.state,'siduri').drive )
        .toMatchObject({
            damage_level: 2,
            current: 0,
        });

    return battle;
};

turns[5] = function turn5(battle) {

    rig_dice([5,3]);

    battle.play_turn(true);

    expect( get_object_by_id(battle.state,'siduri').structure )
        .toMatchObject({
            hull:  { current: 1, max: 4 },
            armor: { current: 1, max: 4 },
        });

    return battle;
};

turns[6] = function turn6(battle) {

    rig_dice([4,6,2]);

    battle.play_turn(true);

    expect( get_object_by_id(battle.state,'siduri').structure )
        .toMatchObject({
            hull:  { current: 1, max: 4 },
            armor: { current: 0, max: 4 },
            status: "nominal"
        });

    return battle;
}

turns[7] = function turn7(battle) {

    rig_dice([5,2,90,90,90]);

    battle.play_turn(true);

    expect( get_object_by_id(battle.state,'siduri').structure )
        .toMatchObject({
            hull:  { current: 0, max: 4 },
            armor: { current: 0, max: 4 },
            status: "destroyed",
        });

    return battle;
}

turns[8] = function turn8(battle) {

    battle.play_turn(true);

    // siduri is gone
    expect( get_object_by_id(battle.state,'siduri') ).toBeUndefined();
    expect( get_object_by_id(battle.state,'enkidu') ).toBeDefined();

    expect( battle.state.log.map( l => l.type ) ).not.toContain( 'FIRE_WEAPON' );

    return battle;
}

turns.splice(4,99);

// turns.push( 
//     async function(battle) { return await wait_forever() }
// )

// jest.setTimeout(30000000);

let  previous = Promise.resolve();
turns = turns.map( t => {
    let p = previous.then(t);
    previous = p;
    return () => p;
});

turns.forEach( (t,i) => {
    test( `turn ${i}`, t );
});

