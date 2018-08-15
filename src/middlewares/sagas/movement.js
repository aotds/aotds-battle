import _ from 'lodash';
import fp from 'lodash/fp';

import { takeEvery, put, select } from 'redux-saga/effects';
import { MOVEMENT_PHASE, bogey_movement } from '~/actions';

import { plot_movement } from '~/movement';

import { subactions } from './utils';

const get_bogeys = state => _.keys( _.get(state, 'bogeys', {}) );

export
function* movement_phase(action) {


    let debug = require('debug')('aotds:test');

    let bogeys = ( yield select( get_bogeys ) ) 
                    |> fp.filter('navigation');

    yield* subactions(action, function*() { 

        for( let bogey of bogeys ) {
            yield put( bogey_movement(
                bogey.id, plot_movement(bogey, _.get(bogey, 'orders.navigation'))
            ))
        }

    })();
}
