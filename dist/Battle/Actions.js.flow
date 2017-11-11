// @flow
import Actioner from '../actioner';

export type ActionBase  = {
    type: any,
    payload?: any,
};

export
type AotdsObject = {
    id: string,
    navigation: Navigation,
};

export type InitGame = {
    type: 'INIT_GAME',
    payload: {
        name: string,
        objects?: Array<AotdsObject>
    }
}

export type MOVE = {
    object_id: string,

};

type ObjectId = { object_id: string }

export type MovementOrder = ActionBase & {
    payload: ObjectId & Navigation
};

let actioner = new Actioner();

actioner.add( 'init_game' );

export type Navigation = {
    coords:     Array<number>,
    velocity:   number,
    heading:    number,
    trajectory: Array<any>,
};

export type ObjectAction = {
    payload: { object_id: string }
};

export type MoveObject = ObjectAction & {
    type: 'MOVE_OBJECT',
    payload: Navigation,
}

export type PlayMoveObject = ObjectAction & {
    type: 'PLAY_MOVE_OBJECT',
};

export type MoveObject = ObjectAction & {
    type: 'MOVE_OBJECT',
    payload: {

    }
};

actioner.add( 'move_object' );

actioner.add( 'play_move_object' );


export default actioner.combined();
export const action_names = actioner.names();

export type ActionType = 'INIT_GAME' 
    | 'MOVE_OBJECT';

//Object.keys( actions ).forEach( action => actioner.$add(action) );
// {
//     additionalProperties: false,
//     object: {
//         name: 'string',
//         objects: {
//             array: {}
//         },
//     },
// });

//export default actioner;
