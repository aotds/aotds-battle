import { combineReducers } from 'redux';

import log from './Reducer/Log';

let reducer = combineReducers( { log } );

export default reducer;

// import Action from './Actions';


// function firecon_reducer( state = {}, action ) {
//     if ( state.id !== action.firecon_id ) {
//         return state;
//     }

//     switch ( action.type ) {
//         case Action.FIRECON_TARGET:
//             return { ...state, target_id: action.target_id };

//         default: return state;
//     }
// }

// function weapon_reducer( state = {}, action ) {
//     if ( state.id !== action.weapon_id ) {
//         return state;
//     }

//     switch ( action.type ) {
//         case Action.FIRECON_WEAPON:
//             return { ...state, firecon_id: action.firecon_id };

//         default: return state;
//     }
// }

// function object_reducer( state = {}, action ) {
//     if ( state.id !== action.object_id ) {
//         return state;
//     }

//     switch ( action.type ) {
//         case Action.FIRECON_TARGET:
//             return { ...state, firecons: state.firecons.map( f => firecon_reducer( f, action ) ) };

//         case Action.FIRECON_WEAPON:
//             return { ...state, weapons: state.weapons.map( f => weapon_reducer( f, action ) ) };

//         case Action.DAMAGE:
//             return { ...state, hull: state.hull - action.damage }

//         case Action.DESTROYED:
//             return { ...state, is_destroyed: true }

//         default: return state;
//     }
// }

// let objects = actionsHandler({
//     [ Action.INIT_GAME ]: (state,action) => action.objects,
//     '*': (state,action) => {

//         if ( action.object_id ) {
//             return state.map( o => object_reducer( o, action ) );
//         }

//         return state;
//     }
// }, [] );


// let game = actionsHandler({
//     [Action.INIT_GAME]: ( state, { name }) => ({ name })
// }, {} );

