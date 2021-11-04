import fp from 'lodash/fp';
import u from '@yanick/updeep';

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

bogeys_dux.addMutation(
    bogeys_dux.actions.bogey_damage,
    ({ bogey_id: id }, action) => u.map(u.if(fp.matches({ id }), bogey.upreducer(action))),
    true,
);

bogeys_dux.addSubEffect(init_game, ({ dispatch }) => ({ payload: { bogeys = [] } }) => {
    bogeys.forEach(bogey => dispatch(actions.add_bogey(bogey)));
});

bogeys_dux.addEffect(actions.try_play_turn, ({ getState, dispatch, selectors }) => () => () => {
    if (selectors.readyForNextTurn(getState())) dispatch(actions.play_turn());
});

bogeys_dux.addSubEffect(actions.movement_phase, ({ dispatch, getState }) => () => {
    getState().forEach(({ id }) => dispatch(bogeys_dux.actions.bogey_movement(id)));
});

bogeys_dux.addSubEffect(actions.bogey_movement, ({ dispatch, getState }) => ({ payload: id }) => {
    const bogey = fp.find({ id }, getState());
    const movement = plotMovement(bogey);
    dispatch(
        bogeys_dux.actions.bogey_movement_res({
            bogey_id: id,
            movement,
        }),
    );
});


export const inflate = (shorthand = []): BogeyState[] => shorthand.map(inflate_bogey);

export default bogeys_dux.asDux;
