import { createStore, applyMiddleware } from "redux";

import _ from 'lodash';
import fp from 'lodash/fp';

import reducer from './reducer';
import MW from './middlewares';

import { actions } from './actions';

const debug = require('debug')('aotds:battle');

export const arcs = {
    F:  [[ -1, 1 ]],
    FS: [[ 1, 3 ]],
    AS: [[ 3, 5 ]],
    A:  [[ 5, 6], [-6,-5]],
    AP: [[ -5, -3 ]],
    FP: [[ -3, -1 ]],
};

import middlewares from './middlewares';

export default class Battle {

    constructor( state = {} ) {

        this.store = createStore( 
            reducer,
            state,
            applyMiddleware( ...middlewares )
        );

        // this.store.subscribe( () => {
        //      schemas.validate(
        //          { '$ref': 'http://aotds.babyl.ca/battle/game_turn'},
        //          this.state
        //      )
        // });

    }

    get state() { return this.store.getState() }

    get name() { return fp.get('game.name')(this.state) }
    get turn() { return fp.get('game.name')(this.state) }

    dispatch( action ) {
        return this.store.dispatch(action);
    }

    dispatch_action( name, ...args ) {
        return this.store.dispatch( actions[name](...args) );
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


*/
