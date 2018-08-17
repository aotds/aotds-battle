import fp from 'lodash/fp';

import {toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({toBeDeepCloseTo, toMatchCloseTo });

import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');
debug.inspectOpts.depth = 99;

import { cheatmode, rig_dice } from './dice';

import Battle from './index';

let turns = [ () => Promise.resolve( new Battle() ) ];

turns[1] = (battle) => {

    battle.dispatch_action( 'init_game', {
        game: {
            name: 'gemini', 
            players: [ { id: "yanick" }, { id: "yenzie" } ],
        },
        bogeys: [
            { name: 'Enkidu', id: 'enkidu',
                drive: { current: 6 },
                navigation: {
                    coords: [ 0,0 ],
                    heading: 0,
                    velocity: 0,
                },
                weaponry: {
                    firecons: 1,
                    weapons: [ { 
                        type: "beam", class: 2,
                        arcs: [ 'F' ] },
                        { arcs: [ 'FS' ],
                        type: "beam", class: 1,
                        }, 
                        { arcs: [ 'FP' ],
                        type: "beam", class: 1,
                        } ],
                },
                structure: {
                    hull: 4,
                    shields: [ 1, 2 ],
                    armor: 4,
                    status: 'nominal',
                },
                player_id: "yanick",
            },
            { name: 'Siduri', id: 'siduri',
                drive: { rating: 6, current: 6 },
                navigation: {
                    coords: [ 10,10 ],
                    heading: 6,
                    velocity: 0,
                },
                player_id: "yenzie",
                structure: {
                    hull: 4,
                    shields: [ 1, 2 ],
                    armor: 4,
                    status: 'nominal',
                },
            },
        ],
    });

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
    expect( battle.state.log.map( l => l.type ) ).toEqual([
        'INIT_GAME', 'SET_ORDERS', 'PLAY_TURN', 'SET_ORDERS'
    ]);

    battle.dispatch_action('play_turn');

    expect(battle.state.game).toMatchObject({ turn: 1 });

    // let's check the log
    expect( battle.state.log.map( l => l.type ) ).toEqual([
        'PLAY_TURN', 'MOVE_OBJECTS',
        'MOVE_OBJECT',
        'MOVE_OBJECT',
        'EXECUTE_FIRECON_ORDERS',
        'FIRE_WEAPONS',
        'CLEAR_ORDERS',
    ]);

    // orders cleared out
    battle.state.objects.forEach( obj => 
        expect(obj).not.toHaveProperty('orders', expect.anything() )
    );

    const expect_close = val =>   val.map( v => x => expect(x).toBeCloseTo(v) );

    // ships have moved
    expect( _.find( battle.state.objects, { id: 'enkidu' } ).navigation )
        .toMatchCloseTo({
            heading: 1,
            velocity: 1,
            coords: [ 1.5, 0.9  ],
        },1);

    expect( _.find( battle.state.objects, { id: 'siduri' } ).navigation )
        .toMatchCloseTo({
            heading: 6,
            velocity: 1,
            coords: [ 10, 9  ],
        },1);

        return battle;
};

turns[2] = function turn2(battle) {
    battle.set_orders( 'enkidu', {
        firecons: [ { firecon_id: 1, target_id: 'siduri' } ], 
        weapons: [ { weapon_id: 1, firecon_id: 1 },
            { weapon_id: 2, firecon_id: 1 }, 
            { weapon_id: 3, firecon_id: 1 }, 
        ],
    });

    rig_dice([ 6, 5, 3, 3, 90, 90]);
    battle.play_turn(true);

    expect( _.find( battle.state.objects, { id: 'enkidu' } ).weaponry.firecons )
        .toEqual([
            { id: 1,  target_id: 'siduri' }
        ]);

    expect( _.find( battle.state.objects, { id: 'enkidu' } ).weaponry.weapons[0] )
        .toMatchObject( { id: 1, firecon_id: 1} );

    expect( _.find( battle.state.objects, { id: 'siduri' } ))
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
    expect( _.find( battle.state.objects, { id: 'enkidu' } ).structure )
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
        battle.set_orders( ship, { navigation: { thrust: -1 }, } ) 
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

    debug(battle.state);

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

turns.splice(2,99);

let  previous = Promise.resolve();
turns = turns.map( t => {
    let p = previous.then(t);
    previous = p;
    return () => p;
});

turns.forEach( (t,i) => {
    test( `turn ${i}`, t );
});

