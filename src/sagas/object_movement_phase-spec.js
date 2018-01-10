import tap from 'tap';
import _ from 'lodash';

import Action from '../actions';
import { put } from 'redux-saga/effects';

import {
    object_movement_phase
} from './index';

let enkidu = { id: 'enkidu' };
let siduri = { id: 'enkidu' };

tap.test( 'object_movement_phase', { autoend: true }, tap => {
    let phase = object_movement_phase(
        Action.object_movement_phase('enkidu')
    ); 

    tap.ok( phase.next().value.SELECT, 'want the ship' )

    tap.include( phase.next( { id: 'enkidu' }).value,
        { foo: 1 },
    );


});
