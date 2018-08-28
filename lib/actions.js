"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = exports.types = undefined;

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _actioner = require("actioner");

var _actioner2 = _interopRequireDefault(_actioner);

var _jsonSchemaShorthand = require("json-schema-shorthand");

var _schemas = require("./schemas");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// TODO schema_include but for the whole schema. 
// definitions: { } ?
let actioner = new _actioner2.default({
  validate: true,
  ajv: _schemas.ajv,
  schema_id: 'http://aotds.babyl.ca/battle/actions',
  definitions: {
    meta: {
      type: "object",
      properties: {
        id: {
          description: "action id",
          type: "number"
        },
        timestamp: {
          type: "string"
        },
        parent_action: {
          type: "number"
        }
      }
    }
  },
  schema_include: {
    additional_properties: false,
    properties: {
      meta: '#/definitions/meta'
    }
  }
});
actioner.add('new_turn');
actioner.add('inc_action_id');
actioner.add('init_game', (0, _jsonSchemaShorthand.object)({
  game: (0, _jsonSchemaShorthand.object)({
    name: (0, _jsonSchemaShorthand.string)()
  }),
  objects: (0, _jsonSchemaShorthand.array)()
}));
actioner.add('set_orders', (bogey_id, orders) => ({
  bogey_id,
  orders
}), (0, _jsonSchemaShorthand.object)({
  bogey_id: 'string!',
  orders: (0, _jsonSchemaShorthand.object)({
    navigation: (0, _jsonSchemaShorthand.object)({
      thrust: (0, _jsonSchemaShorthand.integer)(),
      turn: (0, _jsonSchemaShorthand.integer)(),
      bank: (0, _jsonSchemaShorthand.integer)()
    }),
    firecons: (0, _jsonSchemaShorthand.object)({
      target_id: 'string'
    }),
    weapons: (0, _jsonSchemaShorthand.object)({
      firecon_id: 'string'
    })
  })
}));
actioner.add('movement_phase');
actioner.add('move_objects_done');
actioner.add('bogey_movement', (bogey_id, navigation) => ({
  bogey_id,
  navigation
}), (0, _jsonSchemaShorthand.object)({
  bogey_id: 'string!',
  navigation: {
    '$ref': 'http://aotds.babyl.ca/battle/ship#/definitions/navigation'
  }
}));
actioner.add('play_turn', function (force = false) {
  return {
    force
  };
});
actioner.add('start_turn');
actioner.add('clear_orders');
actioner.add('firecon_orders_phase');
actioner.add('weapon_orders_phase');
actioner.add('weapon_firing_phase');
actioner.add('execute_firecon_orders', (bogey_id, firecon_id, orders) => {
  return {
    bogey_id,
    firecon_id: Number(firecon_id),
    orders
  };
});
actioner.add('execute_weapon_orders', (bogey_id, weapon_id, orders) => ({
  bogey_id,
  weapon_id,
  orders
}));
actioner.add('fire_weapons');
actioner.add('bogey_fire_weapon', (bogey_id, target_id, weapon_id) => ({
  bogey_id,
  target_id,
  weapon_id
}), (0, _jsonSchemaShorthand.object)({
  bogey_id: 'string!',
  target_id: 'string!',
  weapon_id: 'integer!'
}));
actioner.add('damage', (bogey_id, weapon_type, dice, penetrating = false) => _updeep2.default.if(penetrating, {
  penetrating: true
})({
  bogey_id,
  weapon_type,
  dice
}));
actioner.add('internal_damage_check', (bogey_id, hull) => ({
  bogey_id,
  hull: _extends({}, hull, {
    damage: hull.previous - hull.current
  })
}), (0, _jsonSchemaShorthand.object)({
  bogey_id: 'string!',
  hull: (0, _jsonSchemaShorthand.object)({
    max: 'number!',
    current: 'number!',
    previous: 'number!',
    damage: 'number!'
  })
}, "check if any internal system was damaged"));
actioner.add('internal_damage', (bogey_id, system, dice) => ({
  bogey_id,
  system,
  dice
}));
actioner.add('assign_weapons_to_firecons');
actioner.add('assign_weapon_to_firecon', (bogey_id, weapon_id, firecon_id) => ({
  bogey_id,
  weapon_id,
  firecon_id
}));
actioner.add('assign_target_to_firecon', (bogey_id, firecon_id, target_id) => ({
  bogey_id,
  target_id,
  firecon_id
}));
actioner.add('push_action_stack', action_id => ({
  action_id
}), (0, _jsonSchemaShorthand.object)({
  action_id: 'number!'
}));
actioner.add('pop_action_stack');
exports.default = actioner;
const types = exports.types = actioner.types;
const actions = exports.actions = actioner.actions;

_lodash2.default.merge(module.exports, actioner.mapped_types, actioner.actions);