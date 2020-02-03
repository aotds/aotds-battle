import fp from 'lodash/fp';

import { compose, createStore, applyMiddleware, Store, Reducer } from 'redux';
import { Action } from '../reducer/types';
import reducer from '../store/reducer';
import { try_play_turn, init_game, InitGamePayload } from '../store/actions/phases';
import { log_skipper } from '../store/log/middleware';
import { timestamp } from '../store/middleware/timestamp';
import { action_id_mw_gen } from '../store/middleware/action_id';
import mw_play_phases from '../store/middleware/play_phases';
import mw_bogey_firecon_orders from '../middleware/firecons_phase';
import mw_bogey_weapon_orders from '../middleware/weapons_phase';

import { set_orders } from '../store/bogeys/bogey/actions';
import { OrdersState } from '../store/bogeys/bogey/orders/types';

import { BattleState } from '../store/types';

import { mw_movement_phase } from '../middleware/movement_phase';
import mw_weapons_firing_phase from '../middleware/weapons_firing_phase';
import mw_weapons from '../middleware/weapons';

import { middleware as battle_middleware } from '../store';

type BattleOpts = {
    name: string;
    devtools?: {};
    state?: {};
    persist?: {
        storage: any,
        persistReducer: Function,
    };
};

export class Battle {
    store: Store<BattleState>;

    persistor?: any;
    ready?: Promise<Battle>;

    constructor(opts: BattleOpts) {

        let enhancers = applyMiddleware(
            log_skipper(['TRY_PLAY_TURN']),
            timestamp,
            action_id_mw_gen(),
            mw_play_phases,
            mw_bogey_firecon_orders,
            mw_bogey_weapon_orders,
            mw_movement_phase,
            mw_weapons,
            battle_middleware
        );

        if (opts.devtools) {
            enhancers = require('remote-redux-devtools').composeWithDevTools(
                fp.defaults({ port: 8000, hostname: 'localhost' }, opts.devtools),
            )(enhancers);
        }

        let myReducer = reducer;

        if (opts.persist) {
            let pr = opts.persist.persistReducer || require('redux-persist-pouchdb').persistReducer;


            myReducer = pr({storage : opts.persist.storage, key: opts.name },myReducer);
        }

        this.store = createStore(myReducer, opts.state, enhancers);

        if (opts.persist) {
            this.ready = new Promise((accept, reject) => {
                const { persistStore } = require('redux-persist');
                this.persistor = persistStore(this.store, null, () => {
                    accept(this);
                });
            });
        }
    }

    dispatch(action: Action) {
        return this.store.dispatch(action);
    }

    get state(): BattleState {
        return this.getState();
    }

    getState() {
        return this.store.getState();
    }
}

export default Battle;
