import Updux, { DuxState } from 'updux';
import bogey, { inflateBogey } from './bogey';
import fp from 'lodash/fp';
import u from 'updeep';
import play_phases from '../playPhases';
import subactions from '../subactions';
import { plotMovement } from './bogey/rules/plotMovement';

type BogeyState = DuxState<typeof bogey>;

const getBogey = (bogeys: BogeyState[]) => (id: string) => fp.find({ id }, bogeys);

// -- actions

const { bogey_movement, bogey_movement_move } = bogey.actions;

// --

const dux = new Updux({
    initial: [] as BogeyState[],
    subduxes: {
        '*': bogey,
    },
    selectors: { getBogey },
});

const singleBogey: any = (prop = 'bogey_id') => (payload, action) =>
    u.map(u.if(fp.matches({ id: payload[prop] }), bogey.upreducer(action)));

[
    bogey.actions.set_orders,
    bogey_movement_move,
    bogey.actions.set_orders,
    bogey.actions.bogey_firecon_orders,
    bogey.actions.bogey_weapon_orders,
].forEach(action => dux.addMutation(action, singleBogey(), true));

dux.addEffect(
    play_phases.actions.movement_phase,
    subactions(({ getState, dispatch }) => () => {
        fp.map('id', getState()).forEach(id => dispatch(bogey_movement(id)));
    }),
);

dux.addEffect(
    bogey_movement,
    subactions(({ getState, dispatch }) => (action: ReturnType<typeof bogey_movement>) => {
        const bogey = getBogey(getState())(action.payload);
        if (bogey) dispatch(bogey_movement_move(bogey.id, plotMovement(bogey)));
    }),
);

dux.addEffect(
    play_phases.actions.firecon_orders_phase,
    subactions(({ getState, dispatch }) => () => {
        const bogeys = getState();
        bogeys.forEach(({ id, orders }: BogeyState) => {
            orders.firecons?.forEach(orders => dispatch(bogey.actions.bogey_firecon_orders(id, orders)));
        });
    }),
);

dux.addEffect(
    play_phases.actions.weapon_orders_phase,
    subactions(({ getState, dispatch }) => () => {
        const bogeys = getState();
        bogeys.forEach(({ id, orders }: BogeyState) => {
            orders.weapons?.forEach(orders => dispatch(bogey.actions.bogey_weapon_orders(id, orders)));
        });
    }),
);

export default dux.asDux;

export function inflateBogeys(shorthand: any) {
    return u.map(inflateBogey, shorthand);
}
