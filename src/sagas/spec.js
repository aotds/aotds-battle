import tap from 'tap';
import _ from 'lodash';

import Action from '../actions';
import { put } from 'redux-saga/effects';

import {
    turn_movement_phase
} from './index';

let enkidu = { id: 'enkidu' };
let siduri = { id: 'enkidu' };

tap.test( 'turn_movement_phase', { autoend: true }, tap => {
    let phase = turn_movement_phase(); 

    tap.ok( phase.next().value.SELECT, 'want the ships' )

    tap.include( phase.next( [ { id: 'enkidu' }, { id: 'siduri' } ]).value,
        put(Action.object_movement_phase('enkidu')),
    );

    tap.include( phase.next().value,
        put(Action.object_movement_phase('siduri')),
    );

});
