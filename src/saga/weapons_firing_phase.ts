import { select } from 'redux-saga/effects';
import { get_bogeys } from "../store/selectors";
import { BogeyState } from '../store/bogeys/bogey/types';
import {oc} from 'ts-optchain';
import { put } from '@redux-saga/core/effects';
import { fire_weapon, weapons_firing_phase } from "../store/actions/phases";

export
function* weapons_firing_phase_saga ( ) {

    let ships :BogeyState[] = yield select( get_bogeys );

    for( const ship of ships ) {
        // TODO check if the ship is still operational
        for( const firecon of oc(ship).weaponry.firecons([]) ) {
            if( ! firecon.target_id ) continue;

            // TODO check if the firecon is still operational

            for ( const weapon of oc(ship).weaponry.weapons([]) ) {
                if( weapon.firecon_id !== firecon.id ) continue;

                // TODO check if the weapon is still operational

                yield put( fire_weapon( ship.id, firecon.target_id, weapon.id) );
            }

        }
    }
}

