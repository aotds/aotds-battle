const shorthand_json = require( 'json-schema-shorthand' ).default;
import _ from 'lodash';

function shorthand () { return shorthand_json(this) };

let schemas = {};

let type_coords = 
    { type: 'array', items: { type: 'number' }, maxItems: 2, minItems: 2 };


schemas.battle = ({
    id: "/battle",
    description: "store for an AotDS battle",
    definitions: {
        game: {
            description: "information about the game itself",
            additionalProperties: false,
            object: {
                name: 'string',
            }
        },
        log_entry: {
            '$ref': '/actions',
        },
    },
    object: {
        game: '#/definitions/game', 
        objects: {
            array: { $ref: 'aotds_object' },
        },
        log: {
            array: '#/definitions/log_entry'
        },
    },
})::shorthand();

schemas.aotds_object = ({
    description: "ships, asteroids, fighters",
    additionalProperties: false,
    object: {
        name: 'string',
        id: 'string',
        heading: 'number',
        coords: type_coords,
        firecons: { },
        engine_rating: 'number',
        hull: 'number',
        max_hull: 'number',
        weapons: { },
        is_destroyed: { type: 'boolean' },
    }
})::shorthand();


const type_number_basic = {
    type: 'number',
    default: 0,
};

schemas.orders = { 
    default: { trust: 0, turn: 0, bank: 0 },
    name: 'Orders',
    type: 'object',
    properties: {
        thrust: type_number_basic,
        turn:   type_number_basic,
        bank:   type_number_basic,
    },
};

schemas.navigation = {
    type: 'object',
    properties: {
        engine_rating: type_number_basic,
    },
};


schemas.movement = {
    type: 'object',
    properties: {
        velocity: { type: 'number', default: 0 },
        heading:  { type: 'number', default: 0 },
        coords:   { type: 'array',  default: [ 0, 0 ] },
        trajectory: { $ref: 'trajectory' },
    },
    additionalProperties: false,
};

let trajectory_type = (name, ...args) => ({ [name]: {
    type: 'array',
    items: [
        { const: name },
        ...args,
    ],
    additionalItems: false,
}});

schemas.trajectory = {
    type: 'array',
    items: { oneOf: [
        { $ref: '#/definitions/POSITION' },
        { $ref: '#/definitions/ROTATE' },
        { $ref: '#/definitions/MOVE' },
    ]},
    definitions: {
        ...trajectory_type( 'POSITION', type_coords ),
        ...trajectory_type( 'ROTATE', { type: 'number' } ),
        ...trajectory_type( 'MOVE', type_coords ),
    },
};

_.forEach( schemas, (v,k) => v.id = v.id || '/' + k );

export let actions = {};

actions.weapon_fired = {
    type: 'object',
    properties: {
        type: { const: 'WEAPON_FIRED' },
        object_id: { type: 'string' },
        target_id: { type: 'string' },
        weapon_id: { type: 'number' },
        distance: { type: 'number' },
        bearing: { type: 'number' },
        dice:             { type: 'array', items: { type: 'number' } },
        dice_penetrating: { type: 'array', items: { type: 'number' } },
        no_firing_arc: {  type: 'boolean', default: false },
        out_of_range: {  type: 'boolean', default: false },
    },
    additionalProperties: false,
};

actions.damage = {
    type: 'object',
    properties: {
        type: { const: 'DAMAGE' },
        object_id: { type: 'string' },
        damage: {  type: 'number' },
        is_penetrating: { type: 'boolean', default: false },
    }
};

actions.firecon_target = {
    type: 'object',
    properties: {
        type: { const: 'FIRECON_TARGET' },
        object_id:  { type: 'string' },
        target_id:  { type: 'string' },
        firecon_id: { type: 'number' },
    },
    additionalProperties: false,
};

actions.firecon_fire = {
    type: 'object',
    properties: {
        type: { const: 'FIRECON_FIRE' },
        object_id:  { type: 'string' },
        firecon_id: { type: 'number' },
    },
    additionalProperties: false,
};

actions.destroyed = {
    type: 'object',
    properties: {
        type: { const: 'DESTROYED' },
        object_id:  { type: 'string' },
    },
    additionalProperties: false,
};

actions.firecons_fire = {
    type: 'object',
    properties: {
        type: { const: 'FIRECONS_FIRE' },
        object_id:  { type: 'string' },
    },
    additionalProperties: false,
};

actions.firecon_weapon = {
    type: 'object',
    properties: {
        type: { const: 'FIRECON_WEAPON' },
        object_id:  { type: 'string' },
        firecon_id:  { type: 'number' },
        weapon_id:  { type: 'number' },
    },
    additionalProperties: false,
};

actions.weapon_fire = {
    type: 'object',
    properties: {
        type: { const: 'WEAPON_FIRE' },
        object_id:  { type: 'string' },
        target_id:  { type: 'string' },
        weapon_id:  { type: 'number' },
    },
    additionalProperties: false,
};

actions.init_game = {
    type: 'object',
    properties: {
        type: { const: 'INIT_GAME' },
        name: { type: 'string' },
        objects: { 
            type: 'array', 
            items: { '$ref': '/aotds_object' },
        }
    },
    additionalProperties: false,
};

schemas.actions = {
    id: '/actions',
    oneOf: [
    ],
};

_.forEach( actions, (v,k) => {
    let id = '/action/' + k;
    v.id = id;
    schemas[ id ] = v;
    schemas.actions.oneOf.push({ $ref: id });
});


import JsonSchemaValidator from '../json-schema-type-checking';

const json_validator = JsonSchemaValidator({ schemas });

export const validate = json_validator.validate;

export default schemas;
