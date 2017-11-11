// @flow

import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga';

import _ from 'lodash';

import logger from '../Logger';
import reducer from './Reducer';

import type { BattleState, BattleAction } from './Types';

import actions from './Actions';
import sagas from './Sagas';

type InitOptions = {
    name: string
};

const MW_logger = store => next => action => {
    logger.trace({ action }, 'action entering middleware');
    next(action);
};


export default
class Battle {
    store : any;

    constructor ( options : {} = {} ) {
        const MW_saga = createSagaMiddleware();

        this.store = createStore( 
            reducer,
            options.state || {},
            applyMiddleware( MW_logger, MW_saga )
        );
        MW_saga.run( sagas );
    }

    // init_game = payload => this.store.dispatch(
    //     Action.init_game(payload)
    // ) 

    get state () :BattleState { return this.store.getState() }

    dispatch( action : BattleAction ) :any {
        return this.store.dispatch(action);
    }

    dispatch_action( type: string, payload: any ) {
        return this.dispatch({ type, payload });
    }

    // init a game
    init( init_options : InitOptions ) {
        this.dispatch( actions.init_game(init_options) );
    }

};

/**
 * build middlewares for only certain types of actions
 * @param actions list of action types the middleware should be invoked for
 */
/*
function for_actions(...actions) {
    return store => next => action => {
        if (  actions.indexOf( action.type ) > -1 ) {
            this(store)(next)(action);
        }
        else {
            next(action);
        }
    };
}

const MW_firecons_fire = ( store => next => action => {
    let state = store.getState();

    next(action);

    _( _(state.objects).find({ id: action.object_id }) )
        .get( 'firecons', [] )
        .filter( f => f.target_id )
        .forEach( f => {
            let a = Action.firecon_fire({ object_id: action.object_id, firecon_id: f.id });
            console.log( 'a', a );
            store.dispatch(a);
        });
} ) ::for_actions( Action.FIRECONS_FIRE );

const MW_firecon_fire = ( store => next => action => {
    let state = store.getState();

    next(action);

    let ship = _.find( state.objects, { id: action.object_id } );

    let firecon = _.find( ship.firecons, { id: action.firecon_id } );

     _.get( ship, 'weapons', [] )
        .filter( f => f.firecon_id === firecon.id )
        .forEach( f => {
            let a = Action.weapon_fire({ object_id: action.object_id, weapon_id: f.id, target_id: firecon.target_id });
            store.dispatch(a);
        });
} ) ::for_actions( Action.FIRECON_FIRE );

function percolate_action() {
    return  store => next => action => {
        next(action);
        this(store)(next)(action);
    };
}

const find_object  = function(id) { return _.find( this.objects,  { id } ) };
const find_firecon = function(id) { return _.find( this.firecons, { id } ) };
const find_weapon  = function(id) { return _.find( this.weapons,  { id } ) };


let middlewares = [
    MW_firecons_fire,
    MW_firecon_fire,
];

import createSagaMiddleware from 'redux-saga';
import battle_saga from './saga';



*/
