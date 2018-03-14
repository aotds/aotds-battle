import Actioner from 'actioner';
import { object, array, string, integer } from 'json-schema-shorthand';

let actioner = new Actioner();

actioner.$add( 'init_game', object({
    game: object({
        name: string(),
    }),
    objects: array(),
}));

actioner.$add( 'set_orders',
    (object_id,orders) => ({ object_id, orders }),
    object(
        {
            object_id: string(),
            orders: object({
                navigation: object({
                    thrust: integer(),
                    turn:   integer(),
                    bank:   integer(),
                }),
            }),
        }, { required: [ 'object_id' ] }
    )
);

actioner.$add( 'move_objects' );
actioner.$add( 'move_object', object_id => ({ object_id }), object({
    object_id: 'string!'
}));
actioner.$add( 'move_object_store', (object_id,navigation) => ({ object_id, navigation }), object({
    object_id: 'string!',
    navigation: { '$ref': 'http://aotds.babyl.ca/battle/action' },
}));

actioner.$add( 'play_turn' );

export default actioner;
