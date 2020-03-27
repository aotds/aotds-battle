import Updux, {DuxState} from 'updux';
import { action, empty } from 'ts-action';
import subactions from '../subactions';
import fp from 'lodash/fp';

import game from '../game';
import bogeys from '../bogeys';

type State = {
    game: DuxState<typeof game>,
    bogeys: DuxState<typeof bogeys>,
}

const play_turn = action('play_turn', empty());
const try_play_turn = action('try_play_turn', empty());

export const phases = [
    'movement_phase',
    'firecon_orders_phase',
    'weapon_orders_phase',
    'weapon_firing_phase',
    'clear_orders',
];

const movement_phase = action('movement_phase', empty());
const firecon_orders_phase = action('firecon_orders_phase', empty());
const weapon_orders_phase = action('weapon_orders_phase', empty());
const weapon_firing_phase = action('weapon_firing_phase', empty());
const clear_orders = action('clear_orders', empty());

const getActivePlayers = ( state: State ) => {
    return fp.uniq( state.bogeys.map( ({player_id}) => player_id ).filter( i => i ) );
}

const getBogeysWaitingOrders = ( state: State ) => {
    return state.bogeys.filter( ({orders}) => !orders?.done ).map( ({id}) => id);
}

function readyForNextTurn(state) {

    // any bogey waiting for orders? can't play turn
    if (getBogeysWaitingOrders(state).length > 0) return false;

    // don't play a turn if there's only 1 player left
    if (getActivePlayers(state).length <= 1) return false;

    return true;
}

const dux = new Updux({
    actions: {
        try_play_turn,
        play_turn,
        movement_phase,
        firecon_orders_phase,
        weapon_orders_phase,
        weapon_firing_phase,
        clear_orders,
    },
});

dux.addEffect(
    play_turn,
    subactions(({ dispatch}) => () => {
        phases.map(p => dux.actions[p]()).forEach(dispatch);
    }),
);

dux.addEffect( try_play_turn, ({getState,dispatch}) => next => action => {
   if( readyForNextTurn(getState()) ) dispatch( play_turn() );
});

export default dux.asDux;
