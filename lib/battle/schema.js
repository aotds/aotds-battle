const shorthand_json = require( 'json-schema-shorthand' ).default;

function shorthand () { return shorthand_json(this) };

let schema = ({
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

schema.definitions.orders = { 
    default: { trust: 0, turn: 0, bank: 0 },
    name: 'Orders',
    type: 'object',
    properties: {
        thrust: type_number_basic,
        turn:   type_number_basic,
        bank:   type_number_basic,
    },
};

schema.definitions.navigation = {
    type: 'object',
    properties: {
        engine_rating: type_number_basic,
    },
};


export default schema;
