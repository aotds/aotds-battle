import { Middleware } from "redux";
import { get_bogeys } from "../store/selectors";
import {oc} from 'ts-optchain';
import { fire_weapon, weapons_firing_phase } from "../store/actions/phases";
import _ from 'lodash';
import { subactions_mw_for } from "./subactions";


export const mw_weapons_firing_phase_inner :Middleware = ({getState,dispatch}) => () => () => {

    let ships = get_bogeys( getState() );

    ships.forEach( ship => {
        oc(ship).weaponry.firecons([]).forEach( (firecon,firecon_id) => {
            if( ! firecon.target_id ) return;

            _.filter( oc(ship).weaponry.weapons([]), { firecon_id }).forEach(
                ({id:weapon_id}) => {
                    dispatch( fire_weapon( ship.id, firecon.target_id, weapon_id ) );
                }
            )
        })
    });
};

export const mw_weapons_firing_phase = subactions_mw_for(
    weapons_firing_phase, mw_weapons_firing_phase_inner
)
