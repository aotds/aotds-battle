import Updux from "updux";
import { action, empty } from "ts-action";
import subactions from "../subactions";


const dux = new Updux();
export default dux;

const play_turn = action('play_turn', empty());

export const phases = [
    'movement_phase',
    'firecon_orders_phase',
    'weapon_orders_phase',
    'weapon_firing_phase',
    'clear_orders',
];

phases.forEach(p => dux.addAction(p, action(p, empty())));

dux.addEffect(
    play_turn,
    subactions(({dispatch,actions}) => action => {
        phases.map(p => actions[p]()).forEach( dispatch );
    }),
);
