import u from 'updeep';
import _ from 'lodash';

import Actioner from 'actioner';
import { object, array, string, integer } from 'json-schema-shorthand';

import { ajv } from './schemas';

// TODO schema_include but for the whole schema. 
// definitions: { } ?
let actioner = new Actioner({
    validate: true,
    ajv,
    schema_id: 'http://aotds.babyl.ca/battle/actions',
    definitions: {
        meta: {
            type: "object",
            properties: {
                id: { description:  "action id", type:  "number", },
                timestamp: { 
                    type: "number",
                },
                parent_action: {
                    type: "number",
                },
            },
        },
    },
    schema_include: {
        additional_properties: false,
        properties: {
            meta: '#/definitions/meta',
        },
    },
});

actioner.add('inc_action_id');

actioner.add( 'init_game', object({
    game: object({
        name: string(),
    }),
    objects: array(),
}));

actioner.add( 'set_orders',
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
                    target_id: 'string'
                })),
            }),
        }, { required: [ 'object_id' ] }
    )
);

actioner.add( 'movement_phase' );
actioner.add( 'move_objects_done' );
actioner.add( 'bogey_movement', (object_id,navigation) => ({ object_id, navigation }), object({
    object_id: 'string!',
    navigation: { '$ref': 'http://aotds.babyl.ca/battle/ship#/definitions/navigation' },
}));

actioner.add( 'play_turn', function(force=false) { return { force }} );
actioner.add( 'start_turn' );
actioner.add( 'clear_orders' );

actioner.add( 'execute_firecon_orders' );
actioner.add( 'execute_ship_firecon_orders',
    ( object_id, firecon_id, orders ) => {
        return {
            object_id,
            firecon_id,
            ...orders,
        };
    },
);

actioner.add( 'fire_weapons' );

actioner.add( 'fire_weapon', 
    ( object_id, target_id, weapon_id ) => ({
        object_id, target_id, weapon_id
    }),
    object({
        object_id: 'string!',
        target_id: 'string!',
        weapon_id: 'integer!',
   })
);

actioner.add( 'damage', ( object_id, weapon_type, dice, penetrating=false ) => 
    u.if( penetrating, { penetrating: true })({ object_id, weapon_type, dice })
);

actioner.add( 'internal_damage_check', ( bogey_id, hull ) => ({
    bogey_id, hull: { ...hull, damage: hull.previous - hull.current }
}), object( {
    bogey_id: 'string!',
    hull: object({
        max: 'number!',
        current: 'number!',
        previous: 'number!',
        damage: 'number!',
    })
}, "check if any internal system was damaged"));


actioner.add( 'internal_damage', ( bogey_id, system, dice ) => ({
    bogey_id, system, dice
}));

actioner.add( 'assign_weapons_to_firecons'  );
actioner.add( 'assign_weapon_to_firecon', (bogey_id, weapon_id, firecon_id) =>({
    bogey_id, weapon_id, firecon_id
}));

actioner.add( 'assign_target_to_firecon', (bogey_id, firecon_id, target_id) =>({
    bogey_id, target_id, firecon_id
}));

actioner.add( 'push_action_stack', action_id => ({
    action_id
}), object({ action_id: 'number!' }) );

actioner.add('pop_action_stack');

export default actioner;

export const types = actioner.types;
export const actions = actioner.actions;

_.merge( module.exports, actioner.mapped_types, actioner.actions );
