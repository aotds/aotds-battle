import Updux from '../BattleUpdux';
import u from '@yanick/updeep';

import log from './log';
import game from './game';
import bogeys from './bogeys';
import next_action_id from './next_action_id';

import * as actions from './actions';

const battle_dux = new Updux({
    initial: {},
    actions,
    subduxes: {
        log,
        game,
        bogeys,
        next_action_id,
    },
});

battle_dux.addEffect('*', () => next => action => next(u.updateIn('meta.timestamp', new Date().toISOString(), action)));

battle_dux.addSubEffect(battle_dux.actions.play_turn, ({ dispatch }) => () => {
    [
        'movement_phase',
        'firecon_orders_phase',
        'weapon_orders_phase',
        'weapon_firing_phase',
        'clear_orders',
    ].forEach(phase => dispatch(battle_dux.actions[phase]()));
});

export default battle_dux.asDux;
