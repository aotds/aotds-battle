import { weapons_firing_phase_saga } from './weapons_firing_phase';
import { put } from 'redux-saga/effects';
import { fire_weapon } from '../store/actions/phases';

const debug = require('debug')('aotds:mw:wfp');

test( "weapons_firing_phase", () => {

    const saga = weapons_firing_phase_saga();
    saga.next();

    let r = saga.next([
        { id: 'enkidu',
            weaponry: {
                firecons: [ { id: 0 }, { id: 1, target_id: 'siduri' } ],
                weapons: [
                    { id: 0},
                    { id: 1, firecon_id: 0 },
                    { id: 2, firecon_id: 1 },
                ]
            },
        },
        { id: 'no firecons',
            weaponry: {
                weapons: [
                    { id: 0},
                    { id: 1, firecon_id: 0 },
                    { id: 2, firecon_id: 1 },
                ]
            },
        }
    ]
    );

    const actions = [ r.value, ...Array.from(saga) ];

    expect( actions ).toMatchObject([
        put( fire_weapon( 'enkidu', 'siduri', 2 ) )
    ]);

});
