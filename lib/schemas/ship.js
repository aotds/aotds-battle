"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonSchemaShorthand = require("json-schema-shorthand");

var _jsonSchemaShorthand2 = _interopRequireDefault(_jsonSchemaShorthand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

let definitions = {};

let coords = _jsonSchemaShorthand.add_definition.call(definitions, 'coords', (0, _jsonSchemaShorthand.array)('number', {
  maxItems: 2,
  minItems: 2
}));

const velocity = _jsonSchemaShorthand.add_definition.call(definitions, 'velocity', (0, _jsonSchemaShorthand.number)({
  description: "speed of the object",
  minimum: 0
}));

const heading = _jsonSchemaShorthand.add_definition.call(definitions, 'heading', (0, _jsonSchemaShorthand.number)({
  description: "facing angle of the object",
  minimum: 0,
  maximum: 12
}));

const heading_coords = {
  heading,
  coords
};

let course = _jsonSchemaShorthand.add_definition.call(definitions, 'course', (0, _jsonSchemaShorthand.array)((0, _jsonSchemaShorthand.object)(heading_coords), {
  description: "projected movement for new turn (for the ui)"
}));

const maneuver_range = _jsonSchemaShorthand.add_definition.call(definitions, 'maneuver_range', "range of values for the maneuver (for the ui)", (0, _jsonSchemaShorthand.array)('number'), {
  nbrItems: 2
});

const maneuvers = _jsonSchemaShorthand.add_definition.call(definitions, 'maneuvers', "range of maneuvers the ship can do for its next move (for the ui)", (0, _jsonSchemaShorthand.object)({
  thrust: maneuver_range,
  bank: maneuver_range,
  turn: maneuver_range
})); // [ { type: 'POSITION', coords: [ 0, 0 ] },
//   { type: 'BANK',
//     delta: [ -1, -6.123233995736766e-17 ],
//     coords: [ -1, -6.123233995736766e-17 ] },
//   { type: 'ROTATE', delta: 1, heading: 1 },
//   { type: 'MOVE',
//     delta: [ 0.9999999999999999, 1.7320508075688774 ],
//     coords: [ -1.1102230246251565e-16, 1.7320508075688774 ] },


const trajectory = _jsonSchemaShorthand.add_definition.call(definitions, 'trajectory', "course of the previous turn", (0, _jsonSchemaShorthand.array)());

let navigation = (0, _jsonSchemaShorthand.object)(_extends({}, heading_coords, {
  velocity,
  trajectory,
  maneuvers
}));
navigation = _extends({}, navigation, {
  course: navigation
});

const orders = _jsonSchemaShorthand.add_definition.call(definitions, 'orders', (0, _jsonSchemaShorthand.object)({
  done: 'boolean',
  navigation: (0, _jsonSchemaShorthand.object)({
    thrust: (0, _jsonSchemaShorthand.number)(),
    turn: (0, _jsonSchemaShorthand.number)(),
    bank: (0, _jsonSchemaShorthand.number)()
  }),
  firecons: (0, _jsonSchemaShorthand.object)({
    target_id: 'string'
  }),
  weapons: (0, _jsonSchemaShorthand.object)({
    firecon_id: 'integer'
  })
}), "orders for the next turn");

const drive = _jsonSchemaShorthand.add_definition.call(definitions, 'drive', (0, _jsonSchemaShorthand.object)({
  rating: 'integer!',
  current: 'integer!',
  thrust_used: 'integer',
  damage_level: {
    type: 'integer',
    enum: [0, 1, 2]
  }
}));

const name = _jsonSchemaShorthand.add_definition.call(definitions, 'name', "name of the ship", 'string');

const firecon = _jsonSchemaShorthand.add_definition.call(definitions, 'firecon', (0, _jsonSchemaShorthand.object)({
  id: 'integer!',
  target_id: 'string'
}));

const weapon = _jsonSchemaShorthand.add_definition.call(definitions, 'weapon', (0, _jsonSchemaShorthand.object)({
  id: 'integer!',
  type: 'string',
  level: 'integer',
  firecon_id: 'integer',
  arcs: (0, _jsonSchemaShorthand.array)({
    enum: ['A', 'F', 'FS', 'FP', 'AS', 'AP']
  })
}));

_jsonSchemaShorthand.add_definition.call(definitions, 'navigation', "navigation-related attributes", (0, _jsonSchemaShorthand.object)(_extends({}, heading_coords, {
  velocity,
  course
})));

const weaponry = _jsonSchemaShorthand.add_definition.call(definitions, 'weaponry', (0, _jsonSchemaShorthand.object)({
  firecons: (0, _jsonSchemaShorthand.object)({}, {
    additionalProperties: firecon
  }),
  weapons: (0, _jsonSchemaShorthand.object)({}, {
    additionalProperties: weapon
  })
}));

const structure = _jsonSchemaShorthand.add_definition.call(definitions, 'structure', (0, _jsonSchemaShorthand.object)({
  hull: (0, _jsonSchemaShorthand.object)({
    current: 'integer',
    max: 'integer'
  }),
  armor: (0, _jsonSchemaShorthand.object)({
    current: 'integer',
    max: 'integer'
  }),
  shields: (0, _jsonSchemaShorthand.object)({}, {
    additionalProperties: {
      id: 'integer',
      level: 'integer'
    }
  }),
  destroyed: 'boolean'
}));

exports.default = (0, _jsonSchemaShorthand.object)({
  id: 'string',
  name,
  navigation,
  orders,
  drive,
  weaponry,
  structure,
  player_id: 'string'
}, {
  '$id': 'http://aotds.babyl.ca/battle/ship',
  definitions,
  title: "Ship"
});