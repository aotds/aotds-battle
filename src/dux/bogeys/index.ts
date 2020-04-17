import Updux, { DuxState } from 'updux';
import bogey, { inflateBogey } from './bogey';
import fp from 'lodash/fp';
import u from 'updeep';
import play_phases from '../playPhases';
import subactions from '../subactions';
import { plotMovement } from './bogey/rules/plotMovement';
import { fireWeapon, isFireWeaponSuccess } from './bogey/weaponry/weapons/rules/fireWeapon';
import { action, payload } from 'ts-action';
import playPhasesDux from '../playPhases';
import genAddSubEffect from '../genAddSubEffect';
import { calculateDamage } from './bogey/weaponry/rules/calculateDamage';

const { weapon_firing_phase } = playPhasesDux.actions;

type BogeyState = DuxState<typeof bogey>;

const getBogey = (bogeys: BogeyState[]) => (id: string) => fp.find({ id }, bogeys);

const bogey_internal_systems_check = action('bogey_internal_systems_check', payload<string>());

const { bogey_movement, bogey_movement_move } = bogey.actions;

const weapon_fire_outcome = action(
    'weapon_fire_outcome',
    payload<
        {
            bogey_id: string;
        } & ReturnType<typeof fireWeapon>
    >(),
);

// --

const dux = new Updux({
    initial: [] as BogeyState[],
    actions: {
        weapon_firing_phase,
        weapon_fire_outcome,
        bogey_internal_systems_check,
    },
    subduxes: {
        '*': bogey,
    },
    selectors: { getBogey },
});

const addSubEffect = genAddSubEffect(dux);

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
    play_phases.actions.weapon_firing_phase,
    subactions(({ getState, dispatch }) => () => {
        getState()
            .map(fp.get('id'))
            .map(bogey.actions.bogey_fire)
            .forEach(dispatch);
    }),
);

addSubEffect(bogey.actions.bogey_fire, ({ getState, dispatch }) => action => {
    const b = dux.selectors.getBogey(getState())(action.payload);
    if (!b) return;

    // no target, no point in firing
    const firecons = fp.filter('target_id', b.weaponry.firecons);

    firecons
        .map(fp.get('id'))
        .map(firecon_id => bogey.actions.firecon_fire({ firecon_id: firecon_id as number, bogey_id: action.payload }))
        .forEach(dispatch as any);
});

addSubEffect(bogey.actions.firecon_fire, ({ getState, dispatch }) => ({ payload: { bogey_id, firecon_id } }) => {
    const b = getBogey(getState())(bogey_id);
    if (!b) return;

    const firecon = bogey.selectors.getFirecon(b)(firecon_id);
    const target_id = firecon.target_id;
    const weapons = fp.filter({ firecon_id }, b.weaponry.weapons);

    fp.map('id', weapons)
        .map(weapon_id =>
            bogey.actions.weapon_fire({
                bogey_id,
                target_id,
                weapon_id,
            }),
        )
        .forEach(action => dispatch(action));
});

addSubEffect(
    bogey.actions.weapon_fire,
    ({ getState, dispatch }) => ({ payload: { bogey_id, target_id, weapon_id } }) => {
        const attacker = getBogey(getState())(bogey_id);
        if (!attacker) return;

        const target = getBogey(getState())(target_id);
        if (!target) return;

        const weapon = bogey.selectors.getWeapon(attacker)(weapon_id);
        if (!weapon) return;

        const result = fireWeapon(attacker.navigation, target.navigation, weapon);

        dispatch(
            weapon_fire_outcome({
                bogey_id: target_id,
                ...result,
            }),
        );
    },
);

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

addSubEffect(play_phases.actions.firecon_orders_phase, ({ getState, dispatch }) => () => {
    const bogeys = getState();
    bogeys.forEach(({ id, orders }) => {
        orders.firecons?.forEach(orders => dispatch(bogey.actions.bogey_firecon_orders(id, orders)));
    });
});

dux.addEffect(
    play_phases.actions.weapon_orders_phase,
    subactions(({ getState, dispatch }) => () => {
        const bogeys = getState();
        bogeys.forEach(({ id, orders }: BogeyState) => {
            orders.weapons?.forEach(orders => dispatch(bogey.actions.bogey_weapon_orders(id, orders)));
        });
    }),
);

addSubEffect(dux.actions.weapon_fire_outcome, ({ getState, dispatch }) => ({ payload }) => {
    if (!isFireWeaponSuccess(payload)) return;

    const bogey = getBogey(getState())(payload.bogey_id);
    if (!bogey) return;

    [
        {
            damage: calculateDamage(bogey, payload.damage_dice),
        },
        {
            damage: calculateDamage(bogey, payload.penetrating_damage_dice),
            is_penetrating: true,
        },
    ]
        .filter(({ damage }) => damage > 0)
        .map(damage => ({ ...damage, bogey_id: bogey.id }))
        .map(dux.actions.bogey_damage)
        .forEach(dispatch as any);
});

addSubEffect(dux.actions.bogey_damage, () => ({ payload: { bogey_id } }) => {
    // internal damage check
});

export default dux.asDux;

export function inflateBogeys(shorthand: any) {
    return u.map(inflateBogey, shorthand);
}
