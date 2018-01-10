import Actioner from './actioner';

let actioner = new Actioner();

actioner.add( 'turn_movement_phase', false );
actioner.add( 'object_movement_phase', ( object_id, orders ) => { object_id, orders } );
actioner.add( 'move_object', ( object_id, navigation ) => { object_id, navigation } );

export default actioner.combined();
