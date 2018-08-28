'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsonSchemaShorthand = require('json-schema-shorthand');

var _jsonSchemaShorthand2 = _interopRequireDefault(_jsonSchemaShorthand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let definitions = {};

let coords = _jsonSchemaShorthand.add_definition.call(definitions, 'coords', (0, _jsonSchemaShorthand.array)('number', { maxItems: 2, minItems: 2 }));

const velocity = _jsonSchemaShorthand.add_definition.call(definitions, 'velocity', (0, _jsonSchemaShorthand.number)({
    description: "speed of the object",
    minimum: 0
}));

const heading = _jsonSchemaShorthand.add_definition.call(definitions, 'heading', (0, _jsonSchemaShorthand.number)({
    description: "facing angle of the object",
    minimum: 0,
    maximum: 12
}));

const heading_coords = { heading, coords };

let course = _jsonSchemaShorthand.add_definition.call(definitions, 'course', (0, _jsonSchemaShorthand.array)((0, _jsonSchemaShorthand.object)(heading_coords), {
    description: "projected movement for new turn"
}));

const maneuver_range = _jsonSchemaShorthand.add_definition.call(definitions, 'maneuver_range', "range of values for the maneuver", (0, _jsonSchemaShorthand.array)('number'), { nbrItems: 2 });

const maneuver = _jsonSchemaShorthand.add_definition.call(definitions, 'maneuver', "range of maneuvers the ship can do for its next move", (0, _jsonSchemaShorthand.object)({
    thrust: maneuver_range,
    bank: maneuver_range,
    turn: maneuver_range
}));

const navigation = (0, _jsonSchemaShorthand.object)(_extends({}, heading_coords, {
    velocity,
    course,
    maneuver
}));

const orders = _jsonSchemaShorthand.add_definition.call(definitions, 'orders', (0, _jsonSchemaShorthand.object)({
    done: 'boolean',
    navigation: (0, _jsonSchemaShorthand.object)({
        thrust: (0, _jsonSchemaShorthand.number)(),
        turn: (0, _jsonSchemaShorthand.number)(),
        bank: (0, _jsonSchemaShorthand.number)()
    })
}), "orders for the next turn");

const drive_rating = _jsonSchemaShorthand.add_definition.call(definitions, 'drive_rating', (0, _jsonSchemaShorthand.number)());

const name = _jsonSchemaShorthand.add_definition.call(definitions, 'name', "name of the ship", string());

exports.default = (0, _jsonSchemaShorthand.object)({
    id: string(),
    name,
    navigation,
    orders,
    drive_rating
}, {
    '$id': 'http://aotds.babyl.ca/battle/ship',
    definitions,
    title: "Ship"
});