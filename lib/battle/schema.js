const shorthand_json = require( 'json-schema-shorthand' ).default;
import _ from 'lodash';

function shorthand () { return shorthand_json(this) };

let schemas = {};

schemas.battle = ({
    id: "http://aotds.babyl.ca/battle",
    description: "store for an AotDS battle",
    definitions: {
        game: {
            description: "information about the game itself",
            additionalProperties: false,
            object: {
                name: 'string',
            }
        },
        aotds_object: {
            description: "ships, asteroids, fighters",
            additionalProperties: false,
            object: {
                name: 'string',
            }
        },
        log_entry: {
            '$ref': 'http://aotds.babyl.ca/battle/actions',
        },
    },
    object: {
        game: '#/definitions/game', 
        objects: {
            array: '#/definitions/aotds_object'
        },
        log: {
            array: '#/definitions/log_entry'
        },
    },
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

let type_coords = 
    { type: 'array', items: { type: 'number' }, maxItems: 2, minItems: 2 };

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

_.forEach( schemas, (v,k) => v.id = v.id || k );

let actions = {};

actions.weapon_fired = {
    type: 'object',
    properties: {
        type: { const: 'WEAPON_FIRED' },
        attacker_id: { type: 'string' },
        target_id: { type: 'string' },
        weapon: { },
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
    }
};

actions.penetrating_damage = {
    type: 'object',
    properties: {
        type: { const: 'PENETRATING_DAMAGE' },
        object_id: { type: 'string' },
        damage: {  type: 'number' },
    }
};

_.forEach( actions, (v,k) => {
    let id = 'action/' + k;
    v.id = id;
    schemas[ id ] = v;
});



export default schemas;
