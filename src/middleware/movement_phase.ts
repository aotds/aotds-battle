import { Middleware } from "redux";
import { get_bogeys, get_bogey } from "../store/selectors";
import { plot_movement } from "../rules/movement";
import { bogey_movement } from "../actions/bogey";
import { movement_phase } from "../store/actions/phases";
import { subactions_mw_for } from "./subactions";


export const move_bogeys : Middleware = ({getState,dispatch}) => () => () => {

    let ship_ids = get_bogeys( getState() ).map( ({id}) => id );

    ship_ids.forEach( id => {
        dispatch( bogey_movement( id, plot_movement(get_bogey(id)(getState())) ) );
    });

};

const mw_bogeys_movement = subactions_mw_for( movement_phase, move_bogeys );
export default mw_bogeys_movement;
