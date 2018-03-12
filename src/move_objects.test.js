import tap from 'tap';
import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');

import Battle from './index';
import saga, { objects_movement_phase } from './sagas';
import { expectSaga } from 'redux-saga-test-plan';

import Actions from './actions';
import { object_by_id } from './sagas/selectors';
import { select } from 'redux-saga/effects';

tap.test( 'move objects', async tap => {

    await expectSaga(objects_movement_phase)
        .withState({
            objects: [ { id: 'enkidu' }, { id: 'siduri' } ],
        })
        .put( Actions.move_object( 'enkidu' ) )
        .put( Actions.move_object( 'siduri' ) )
        .silentRun();

    tap.end();
})


tap.test( 'move object without orders', async tap => {

    await expectSaga(saga)
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
        .put( Actions.move_object_store( 'enkidu', {
            heading: 1, coords: [4,6], velocity: 5
        }))
        .dispatch( Actions.move_object('enkidu') )
        .silentRun();

    tap.end();
})

