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


export default schemas;
