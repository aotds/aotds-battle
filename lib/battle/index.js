import { createStore, applyMiddleware } from "redux";
import _ from 'lodash';

import battle_reducer from './Reducer';
import { validate } from './schema';

import logger from '../Logger';

import Action from './Actions';

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

import { weapon_fire } from './weapons';

const MW_weapon_fire = ( store => next => action => {
    let state = store.getState();

    let ship    = state::find_object( action.object_id );
    let target  = state::find_object( action.target_id );
    let weapon  = ship::find_weapon( action.weapon_id );

    weapon_fire( ship, target, weapon ).forEach( action => {
        logger.debug(action);
        store.dispatch(action) 
    })

} ) ::percolate_action()::for_actions( Action.WEAPON_FIRE );

const MW_object_destroyed = ( store => next => action => {
    let state = store.getState();

    let ship    = state::find_object( action.object_id );

    if( ( ship.hull <= 0 ) && !ship.is_destroyed ) {
        store.dispatch( Action.destroyed({ object_id: ship.id }) );
    }

} ) ::percolate_action()::for_actions( Action.DAMAGE );

let middlewares = [
    MW_firecons_fire,
    MW_firecon_fire,
    MW_weapon_fire,
    MW_object_destroyed,
];


export default
class Battle {
    store;

    constructor ( options = {} ) {
        this.store = createStore( 
            battle_reducer,
            options.state || {},
            applyMiddleware( ...middlewares ),
        );

        // TODO only check for the schema in dev mode
        this.store.subscribe( () => {
            this.store.getState()::validate( 'battle' );
        })
    }

    init_game = payload => this.store.dispatch(
        Action.init_game(payload)
    ) 

    get state () { return this.store.getState() }

    dispatch( action ) {
        return this.store.dispatch(action);
    }

};


