import {toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({toBeDeepCloseTo, toMatchCloseTo });

import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');

import { cheatmode, rig_dice } from './dice';

import * as structure_reducer from './reducer/objects/object/structure';

import Battle from './index';

import { get_object_by_id } from './middlewares/selectors';

import { writeFile } from 'fs';

function turn3(battle) {
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
}

function turn4(battle) {

    rig_dice([6,1,6,2]);

    battle.play_turn(true);

    expect( get_object_by_id(battle.state,'siduri').structure )
        .toMatchObject({
            hull:  { current: 3, max: 4 },
            armor: { current: 1, max: 4 },
        });
}

function turn5(battle) {

    rig_dice([5,3]);

    battle.play_turn(true);

    expect( get_object_by_id(battle.state,'siduri').structure )
        .toMatchObject({
            hull:  { current: 3, max: 4 },
            armor: { current: 0, max: 4 },
        });
}


test( 'shall we play a game?', () => {

    cheatmode();

    const battle = new Battle();

    battle.init_game( {
        game: {
            name: 'gemini', 
            players: [ { id: "yanick" }, { id: "yenzie" } ],
        },
        objects: [
            { name: 'Enkidu', id: 'enkidu',
                drive_rating: 6,
                navigation: {
                    coords: [ 0,0 ],
                    heading: 0,
                    velocity: 0,
                },
                weaponry: {
                    firecons: [
                        { id: 1 },
                    ],
                    weapons: [ { id: 1, 
                        type: "beam", class: 1,
                        arcs: [ 'F' ] },
                        { id: 2, arcs: [ 'FS' ],
                        type: "beam", class: 1,
                        }, 
                        { id: 3, arcs: [ 'FP' ],
                        type: "beam", class: 1,
                        } ],
                },
                player_id: "yanick",
            },
            { name: 'Siduri', id: 'siduri',
                drive_rating: 6,
                navigation: {
                    coords: [ 10,10 ],
                    heading: 6,
                    velocity: 0,
                },
                player_id: "yenzie",
                structure: structure_reducer.inflate_state({
                    hull: 4,
                    shields: [ 1, 2 ],
                    armor: 4,
                }),
            },
        ],
    });

    expect(battle.state).toMatchObject({ 
        game: { name: 'gemini', turn: 0 },
        objects: [
            { name: 'Enkidu' },
            { name: 'Siduri' },
        ],
    });

    let enkidu_orders = { thrust: 1, turn: 1, bank: 1 };

    battle.set_orders( 'enkidu', {
        navigation: enkidu_orders,
    } );

    battle.play_turn();
    
    // not yet...
    expect(battle.state.game.turn).toBe(0);

    battle.set_orders( 'siduri', {
        navigation: { thrust: 1 },
    } );

    expect( _.find( battle.state.objects, { id: 'enkidu' } ).orders.navigation )
    .toMatchObject( enkidu_orders );

    // let's check the log
    expect( battle.state.log.map( l => l.type ) ).toEqual([
        'INIT_GAME', 'SET_ORDERS', 'SET_ORDERS'
    ]);

    battle.play_turn();

    expect(battle.state.log.map( l => l.type ))
        .not.toContain('INIT_GAME');

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

    // turn 2 -- aiming guns at siduri

    battle.set_orders( 'enkidu', {
        firecons: [ { firecon_id: 1, target_id: 'siduri', weapons: [  1,2,3 ] } ], 
    });

    rig_dice([ 6, 5, 3 ]);
    battle.play_turn(true);

    expect( _.find( battle.state.objects, { id: 'enkidu' } ).weaponry.firecons )
        .toEqual([
            { id: 1, weapons: [1,2,3], target_id: 'siduri' }
        ]);

    expect( _.find( battle.state.objects, { id: 'siduri' } ).structure )
        .toMatchObject({
            hull: { current: 3, max: 4 },
            armor: { current: 3, max: 4 },
        });

    turn3(battle);
    turn4(battle);
    turn5(battle);


    debug.inspectOpts.depth = 99;
    debug(battle.state.log);

    writeFile('./state.json',JSON.stringify(battle.state,null,2) );


})

