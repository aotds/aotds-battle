import _ from 'lodash';
import u from 'updeep';
const debug = require('debug')('aotds:battle:test');

import configureStore from 'redux-mock-store'
 
import middlewares, { objects_movement_phase } from './index.js';
const mockStore = configureStore([ objects_movement_phase ])

import Actions from '../actions';
import { get_object_by_id } from './selectors';

test( 'move objects', () => {
    let store = mockStore({
        objects: [ { id: 'enkidu' }, { id: 'siduri' } ],
    });

    store.dispatch( Actions.move_objects() );

    expect( store.getActions() ).toMatchObject( 
        [ Actions.move_objects() ].concat( 
        [ 'enkidu', 'siduri' ].map( Actions.move_object ) ) )


})


test( 'move object without orders', () => {

    let mockStore = configureStore(middlewares);
    let store = mockStore({ objects: [
        { 
            id: 'enkidu',
            navigation: {
                heading: 1,
                coords: [ 1, 2 ],
                velocity: 5,
            },
        }
    ]});

    store.dispatch( Actions.move_object('enkidu') )

    let move = store.getActions()[0];

    const round = x => _.round(x,1)
    const roundup_navigation = u({
        coords: u.map( round ),
        trajectory: u.map( u({
            coords: u.map(round),
            delta:  u.map(round),
        }) )
    });

    move = u({ navigation: roundup_navigation })(move);

    expect(move).toMatchObject({
        object_id: 'enkidu',
        navigation: {
            heading: 1,
            velocity: 5,
            coords: [ 3.5, 6.3 ],
            trajectory: [
                { type: 'POSITION', coords: [1,2] },
                { type: 'MOVE', delta: [2.5,4.3] },
            ],
        }
    });
})

