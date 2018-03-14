import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from 'redux-saga';

import _ from 'lodash';

import reducer from './reducer';
import sagas from './sagas';

import Schemas from './schemas';

import actions from './actions';

const debug = require('debug')('aotds:battle');

let schemas = new Schemas();

export default class Battle {

    constructor( state = {} ) {
        const MW_saga = createSagaMiddleware();

        this.store = createStore( 
            reducer,
            state,
            applyMiddleware( MW_saga )
        );

        this.store.subscribe( () => {
            schemas.validate(
                { '$ref': 'http://aotds.babyl.ca/battle/game_turn'},
                this.state
            )
        });

        MW_saga.run( sagas );
    }

    get state() { return this.store.getState() }

    dispatch( action ) {
        return this.store.dispatch(action);
    }

    init_game( message ) {
        return this.store.dispatch(actions.init_game(message));
    }

    set_orders( ship, orders ) {
        return this.store.dispatch(actions.set_orders(ship,orders));
    }

    play_turn(force = false) {
        return this.store.dispatch(actions.play_turn(force))
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
