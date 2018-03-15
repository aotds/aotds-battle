import {toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({toBeDeepCloseTo, toMatchCloseTo });

import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');

import Battle from './index';

test( 'shall we play a game?', () => {

    const battle = new Battle();

    battle.init_game( {
        game: {
            name: 'gemini',
        },
        objects: [
            { name: 'Enkidu', id: 'enkidu',
                drive_rating: 6,
                navigation: {
                    coords: [ 0,0 ],
                    heading: 0,
                    velocity: 0,
                },
            },
            { name: 'Siduri', id: 'siduri',
                drive_rating: 6,
                navigation: {
                    coords: [ 10,10 ],
                    heading: 6,
                    velocity: 0,
                },
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
        'MOVE_OBJECT', 'MOVE_OBJECT_STORE',
        'MOVE_OBJECT', 'MOVE_OBJECT_STORE',
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

    debug.inspectOpts.depth = 99;
    debug(battle.state.objects);


})

