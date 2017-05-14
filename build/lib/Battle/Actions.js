"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actioner_1 = require("actioner");
var actions = new actioner_1.default({
    schema_id: 'http://aotds.babyl.ca/battle/actions',
    validate: true
});
actions._add('init_game', {
    additionalProperties: false,
    object: {
        name: 'string',
        objects: {
            array: {}
        },
    },
});
exports.default = actions;
