"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var json_schema_shorthand_1 = require("json-schema-shorthand");
var schema = json_schema_shorthand_1.default({
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
exports.default = schema;
