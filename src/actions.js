import u from 'updeep';

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
                firecons: array(object({
                    firecon_id: 'integer',
                    clear: 'boolean',
                    weapons: array( 'integer' ),
                    target_id: 'string'
                })),
            }),
        }, { required: [ 'object_id' ] }
    )
);

actioner.$add( 'move_objects' );
actioner.$add( 'move_objects_done' );
actioner.$add( 'move_object', object_id => ({ object_id }), object({
    object_id: 'string!'
}));
actioner.$add( 'move_object_store', (object_id,navigation) => ({ object_id, navigation }), object({
    object_id: 'string!',
    navigation: { '$ref': 'http://aotds.babyl.ca/battle/action' },
}));

actioner.$add( 'play_turn', function(force=false) { return { force }} );
actioner.$add( 'start_turn' );
actioner.$add( 'clear_orders' );

actioner.$add( 'execute_firecon_orders' );
actioner.$add( 'execute_ship_firecon_orders',
    ( object_id, firecon_id, orders ) => {
        return {
            object_id,
            firecon_id,
            ...orders,
        };
    },
);

actioner.$add( 'fire_weapons' );
actioner.$add( 'fire_weapon', ( object_id, target_id, weapon_id ) => ({
    object_id, target_id, weapon_id
}),{
    object_id: 'string!',
    target_id: 'string!',
    weapon_id: 'integer!',
});

actioner.$add( 'damage', ( object_id, weapon_type, dice, penetrating=false ) => 
    u.if( penetrating, { penetrating: true })({ object_id, weapon_type, dice })
);

actioner.$add( 'internal_damage', ( object_id, system, dice ) => ({
    object_id, system, dice
}));


export default actioner;
