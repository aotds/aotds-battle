'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonSchemaShorthand = require('json-schema-shorthand');

var _jsonSchemaShorthand2 = _interopRequireDefault(_jsonSchemaShorthand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:battle');

const schema = (0, _jsonSchemaShorthand.object)({
    game: (0, _jsonSchemaShorthand.object)({
        name: 'string!',
        turn: 'integer!',
        turn_times: (0, _jsonSchemaShorthand.object)({
            max: 'string',
            started: 'string',
            deadline: 'string'
        }),
        players: (0, _jsonSchemaShorthand.array)((0, _jsonSchemaShorthand.object)({
            id: 'string!',
            status: 'string' }))
    }),
    objects: (0, _jsonSchemaShorthand.array)({ '$ref': 'http://aotds.babyl.ca/battle/ship' })
}, {
    '$id': "http://aotds.babyl.ca/battle/game_turn"
});

exports.default = schema;