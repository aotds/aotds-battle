// @flow
import { actionsHandler } from './utils';

import u from 'updeep';
import _ from 'lodash';

import actions, * as A from '../Actions';

import type { 
    ObjectAction,
    Navigation,
    AotdsObject,
    ActionBase, InitGame, MoveObject } from '../Actions';

import type { ReducerActions } from '../Types';
import {} from '../Types';

type ObjectsState = Array<AotdsObject>;

let reducer : ReducerActions<ObjectsState> = {};

reducer.INIT_GAME = (state, action : InitGame ) => {
    if( action.payload.objects ) 
        return state.concat(action.payload.objects);

    return state;
};

const single_object = ( action : ObjectAction, update ) => u.map(  
    u.if(
        u.is('id', action.payload.object_id ), 
        update
    )
);

reducer.MOVE_OBJECT = ( state, action: MoveObject ) =>
    single_object(
        action, { navigation: action.payload.navigation }
    )(state);

export default actionsHandler( reducer, [] );
