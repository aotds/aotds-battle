'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsonSchemaShorthand = require('json-schema-shorthand');

var _jsonSchemaShorthand2 = _interopRequireDefault(_jsonSchemaShorthand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {};

var coords = _jsonSchemaShorthand.add_definition.call(definitions, 'coords', (0, _jsonSchemaShorthand.array)('number', { maxItems: 2, minItems: 2 }));

var velocity = _jsonSchemaShorthand.add_definition.call(definitions, 'velocity', (0, _jsonSchemaShorthand.number)({
    description: "speed of the object",
    minimum: 0
}));

var heading = _jsonSchemaShorthand.add_definition.call(definitions, 'heading', (0, _jsonSchemaShorthand.number)({
    description: "facing angle of the object",
    minimum: 0,
    maximum: 12
}));

var heading_coords = { heading: heading, coords: coords };

var course = _jsonSchemaShorthand.add_definition.call(definitions, 'course', (0, _jsonSchemaShorthand.array)((0, _jsonSchemaShorthand.object)(heading_coords), {
    description: "projected movement for new turn (for the ui)"
}));

var maneuver_range = _jsonSchemaShorthand.add_definition.call(definitions, 'maneuver_range', "range of values for the maneuver (for the ui)", (0, _jsonSchemaShorthand.array)('number'), { nbrItems: 2 });

var maneuver = _jsonSchemaShorthand.add_definition.call(definitions, 'maneuver', "range of maneuvers the ship can do for its next move (for the ui)", (0, _jsonSchemaShorthand.object)({
    thrust: maneuver_range,
    bank: maneuver_range,
    turn: maneuver_range
}));

// [ { type: 'POSITION', coords: [ 0, 0 ] },
//   { type: 'BANK',
//     delta: [ -1, -6.123233995736766e-17 ],
//     coords: [ -1, -6.123233995736766e-17 ] },
//   { type: 'ROTATE', delta: 1, heading: 1 },
//   { type: 'MOVE',
//     delta: [ 0.9999999999999999, 1.7320508075688774 ],
//     coords: [ -1.1102230246251565e-16, 1.7320508075688774 ] },

var trajectory = _jsonSchemaShorthand.add_definition.call(definitions, 'trajectory', "course of the previous turn", (0, _jsonSchemaShorthand.array)());

var navigation = (0, _jsonSchemaShorthand.object)(_extends({}, heading_coords, {
    velocity: velocity,
    trajectory: trajectory
    // course,
    // maneuver,
}));

var orders = _jsonSchemaShorthand.add_definition.call(definitions, 'orders', (0, _jsonSchemaShorthand.object)({
    done: 'boolean',
    navigation: (0, _jsonSchemaShorthand.object)({
        thrust: (0, _jsonSchemaShorthand.number)(),
        turn: (0, _jsonSchemaShorthand.number)(),
        bank: (0, _jsonSchemaShorthand.number)()
    }),
    firecons: (0, _jsonSchemaShorthand.array)((0, _jsonSchemaShorthand.object)({
        firecon_id: 'integer',
        target_id: 'string',
        weapons: (0, _jsonSchemaShorthand.array)('integer')
    }))
}), "orders for the next turn");

var drive = _jsonSchemaShorthand.add_definition.call(definitions, 'drive', (0, _jsonSchemaShorthand.object)({
    rating: 'integer',
    current: 'integer',
    thrust_used: 'integer',
    damage_level: {
        type: 'integer',
        enum: [0, 1, 2]
    }
}));

var name = _jsonSchemaShorthand.add_definition.call(definitions, 'name', "name of the ship", 'string');

var firecon = _jsonSchemaShorthand.add_definition.call(definitions, 'firecon', (0, _jsonSchemaShorthand.object)({
    id: 'integer',
    target_id: 'string',
    weapons: (0, _jsonSchemaShorthand.array)('integer')
}));

var weapon = _jsonSchemaShorthand.add_definition.call(definitions, 'weapon', (0, _jsonSchemaShorthand.object)({
    id: 'integer',
    type: 'string',
    level: 'integer'
}));

var weaponry = _jsonSchemaShorthand.add_definition.call(definitions, 'weaponry', (0, _jsonSchemaShorthand.object)({
    nbr_firecons: 'integer',
    firecons: (0, _jsonSchemaShorthand.array)(firecon),
    weapons: (0, _jsonSchemaShorthand.array)(weapon)
}));

var structure = _jsonSchemaShorthand.add_definition.call(definitions, 'structure', (0, _jsonSchemaShorthand.object)({
    hull: (0, _jsonSchemaShorthand.object)({ current: 'integer', max: 'integer' }),
    armor: (0, _jsonSchemaShorthand.object)({ current: 'integer', max: 'integer' }),
    shields: (0, _jsonSchemaShorthand.array)({ id: 'integer', level: 'integer' }),
    status: {
        type: 'string',
        enum: ['nominal', 'destroyed']
    }
}));

exports.default = (0, _jsonSchemaShorthand.object)({
    id: 'string',
    name: name,
    navigation: navigation,
    orders: orders,
    drive: drive,
    weaponry: weaponry,
    structure: structure,
    player_id: 'string'
}, {
    '$id': 'http://aotds.babyl.ca/battle/ship',
    definitions: definitions,
    title: "Ship"
});