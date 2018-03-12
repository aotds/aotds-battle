import _ from 'lodash';
import u from 'updeep';
const debug = require('debug')('aotds:battle:test');

import Battle from './index';
import saga, { objects_movement_phase } from './sagas';
import { expectSaga } from 'redux-saga-test-plan';

import Actions from './actions';
import { object_by_id } from './sagas/selectors';
import { select } from 'redux-saga/effects';

test( 'move objects', async () => {
    await expectSaga(objects_movement_phase)
        .withState({
            objects: [ { id: 'enkidu' }, { id: 'siduri' } ],
        })
        .put( Actions.move_object( 'enkidu' ) )
        .put( Actions.move_object( 'siduri' ) )
        .silentRun();

})


test( 'move object without orders', async () => {

    let {effects : { put } } = await expectSaga(saga)
        .provide([ [select(object_by_id,'enkidu'),
            { 
                id: 'enkidu',
                navigation: {
                    heading: 1,
                    coords: [ 1, 2 ],
                    velocity: 5,
                },
            }
        ]])
        .take( Actions.MOVE_OBJECT )
        .dispatch( Actions.move_object('enkidu') )
        .silentRun();

    let move = put[0].PUT.action;

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

