import fp from 'lodash/fp';

import Updux from '../../BattleUpdux';
import { init_game } from '../game/actions';
import * as actions from './actions';
import * as selectors from './selectors';
import bogey from './bogey';

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

bogeys_dux.addMutation(actions.add_bogey, (ship => (state: unknown[]) => [...state, ship]) as any);

bogeys_dux.addSubEffect(init_game, ({ dispatch }) => ({ payload: { bogeys = [] } }) => {
    bogeys.forEach(bogey => dispatch(actions.add_bogey(bogey)));
});

bogeys_dux.addEffect(actions.try_play_turn, ({ getState, dispatch, selectors }) => next => action => {
    if (selectors.readyForNextTurn(getState())) dispatch(actions.play_turn());
});

bogeys_dux.addSubEffect(actions.movement_phase, ({ dispatch, getState }) => () => {
    getState().forEach(({ id }) => dispatch(bogeys_dux.actions.bogey_movement(id)));
});

export default bogeys_dux.asDux;
