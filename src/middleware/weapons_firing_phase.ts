import { Middleware } from "redux";
import { get_bogeys } from "../store/selectors";
import {oc} from 'ts-optchain';
import { fire_weapon, weapons_firing_phase } from "../store/actions/phases";
import _ from 'lodash';
import { mw_subactions_for } from "./subactions";

import { get_bogey } from '../store/selectors';
import { FireconState } from "../store/bogeys/bogey/weaponry/firecon/types";
import { WeaponState } from "../store/bogeys/bogey/weaponry/weapon/reducer";

export const mw_weapons_firing_phase_inner :Middleware = ({getState,dispatch}) => () => () => {

    let ship_ids = get_bogeys( getState() ).map(({id})=>id);

    ship_ids.forEach( id => {
        const bogey = get_bogey( getState(), id );
        oc(bogey).weaponry.firecons([]).forEach( (firecon: FireconState,firecon_id: number) => {
            if( ! firecon.target_id ) return;

            ( _.filter( oc(bogey).weaponry.weapons([]), { firecon_id }) as any ).forEach(
                ({id:weapon_id}: WeaponState) => {
                    dispatch( fire_weapon( bogey.id, firecon.target_id, weapon_id ) );
                }
            )
        })
    });
};

export const mw_weapons_firing_phase = mw_subactions_for(
    weapons_firing_phase, mw_weapons_firing_phase_inner
)

export default mw_weapons_firing_phase;
