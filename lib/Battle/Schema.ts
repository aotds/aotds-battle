import shorthand from 'json-schema-shorthand';

const schema = shorthand({
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
});

export default schema;
