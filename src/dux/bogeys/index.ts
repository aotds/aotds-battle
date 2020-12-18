import fp from 'lodash/fp';
import u from 'updeep';

import Updux from '../../BattleUpdux';
import { init_game } from '../game/actions';
import * as actions from './actions';
import * as selectors from './selectors';
import bogey, { inflate as inflate_bogey } from './bogey';
import plotMovement from './bogey/rules/plotMovement';
import { fire_weapon } from './rules/fireWeapon';
import { calculateDamage } from './rules/calculateDamage';

const bogeys_dux = new Updux({
    initial: [],
    subduxes: {
        '*': bogey,
    },
    actions: {
        ...actions,
        init_game,
    },
    selectors,
});

bogeys_dux.addMutation(actions.add_bogey, (ship => (state: unknown[]) => [...state, inflate_bogey(ship)]) as any);

bogeys_dux.addSubEffect(init_game, ({ dispatch }) => ({ payload: { bogeys = [] } }) => {
    bogeys.forEach(bogey => dispatch(actions.add_bogey(bogey)));
});

bogeys_dux.addEffect(actions.try_play_turn, ({ getState, dispatch, selectors }) => next => action => {
    if (selectors.readyForNextTurn(getState())) dispatch(actions.play_turn());
});

bogeys_dux.addSubEffect(actions.movement_phase, ({ dispatch, getState }) => () => {
    getState().forEach(({ id }) => dispatch(bogeys_dux.actions.bogey_movement(id)));
});

bogeys_dux.addSubEffect(actions.bogey_movement, ({ dispatch, getState }) => ({ payload: id }) => {
    let bogey = fp.find({ id }, getState());
    let movement = plotMovement(bogey);
    dispatch(
        bogeys_dux.actions.bogey_movement_res({
            bogey_id: id,
            movement,
        }),
    );
});

bogeys_dux.addSubEffect(actions.weapon_firing_phase, ({ dispatch, getState }) => () => {
    getState().forEach(bogey => {
        dispatch(actions.bogey_fire(bogey.id));
    });
});

bogeys_dux.addSubEffect(actions.bogey_fire, ({ dispatch, getState }) => ({ payload: id }) => {
    const bogey = fp.find({ id }, getState());
    if (!bogey) return;

    // no target, no point in firing
    const firecons = fp.filter('target_id', bogey.weaponry.firecons);

    firecons
        .map(fp.get('id'))
        .map(firecon_id => actions.firecon_fire({ firecon_id, bogey_id: id }))
        .forEach(dispatch);
});

bogeys_dux.addSubEffect(actions.firecon_fire, ({ getState, dispatch }) => ({ payload: { bogey_id, firecon_id } }) => {
    const bogey = fp.find({ id: bogey_id }, getState());
    if (!bogey) return;

    const firecon = fp.find({ id: firecon_id }, bogey.weaponry.firecons);
    const target_id = firecon.target_id;
    const weapons = fp.filter({ firecon_id }, bogey.weaponry.weapons);

    fp.map('id', weapons)
        .map(weapon_id =>
            actions.weapon_fire({
                bogey_id,
                target_id,
                weapon_id,
            }),
        )
        .forEach(dispatch);
});

bogeys_dux.addSubEffect(
    bogeys_dux.actions.weapon_fire,
    ({ getState, dispatch, selectors, actions }) => ({ payload: { bogey_id, target_id, weapon_id } }) => {
        const bogeys = getState();

        const attacker = selectors.getBogey(bogeys)(bogey_id);
        const target = selectors.getBogey(bogeys)(target_id);

        if (!attacker || !target) return;

        const weapon = bogey.selectors.getWeapon(attacker)(weapon_id);
        if (!weapon) return;

        const outcome = fire_weapon(attacker.navigation, target.navigation, weapon);

        dispatch(
            actions.weapon_fire_outcome({
                bogey_id: target_id,
                outcome,
            }),
        );
    },
);

bogeys_dux.addSubEffect(
    bogeys_dux.actions.weapon_fire_outcome,
    ({ getState, dispatch, selectors }) => ({ payload }) => {
        if (payload.aborted) return;

        const { bogey_id } = payload;

        const bogey = selectors.getBogey(getState())(bogey_id);
        if (!bogey) return;

        [
            {
                damage: calculateDamage(bogey, payload.damage_dice),
            },
            {
                damage: calculateDamage(bogey, payload.penetrating_damage_dice),
                penetrating: true,
            },
        ]
            .filter(({ damage }) => damage > 0)
            .map(damage => ({ ...damage, bogey_id }))
            .map(bogeys_dux.actions.bogey_damage)
            .forEach(dispatch);
    },
);

export const inflate = (shorthand = []) => shorthand.map(inflate_bogey);

export default bogeys_dux.asDux;
