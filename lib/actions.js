'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _actioner = require('actioner');

var _actioner2 = _interopRequireDefault(_actioner);

var _jsonSchemaShorthand = require('json-schema-shorthand');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let actioner = new _actioner2.default();

actioner.$add('init_game', (0, _jsonSchemaShorthand.object)({
    game: (0, _jsonSchemaShorthand.object)({
        name: (0, _jsonSchemaShorthand.string)()
    }),
    objects: (0, _jsonSchemaShorthand.array)()
}));

actioner.$add('set_orders', (object_id, orders) => ({ object_id, orders }), (0, _jsonSchemaShorthand.object)({
    object_id: (0, _jsonSchemaShorthand.string)(),
    orders: (0, _jsonSchemaShorthand.object)({
        navigation: (0, _jsonSchemaShorthand.object)({
            thrust: (0, _jsonSchemaShorthand.integer)(),
            turn: (0, _jsonSchemaShorthand.integer)(),
            bank: (0, _jsonSchemaShorthand.integer)()
        }),
        firecons: (0, _jsonSchemaShorthand.array)((0, _jsonSchemaShorthand.object)({
            firecon_id: 'integer',
            clear: 'boolean',
            target_id: 'string'
        }))
    })
}, { required: ['object_id'] }));

actioner.$add('move_objects');
actioner.$add('move_objects_done');
actioner.$add('move_object', object_id => ({ object_id }), (0, _jsonSchemaShorthand.object)({
    object_id: 'string!'
}));
actioner.$add('move_object_store', (object_id, navigation) => ({ object_id, navigation }), (0, _jsonSchemaShorthand.object)({
    object_id: 'string!',
    navigation: { '$ref': 'http://aotds.babyl.ca/battle/action' }
}));

actioner.$add('play_turn', function (force = false) {
    return { force };
});
actioner.$add('start_turn');
actioner.$add('clear_orders');

actioner.$add('execute_firecon_orders');
actioner.$add('execute_ship_firecon_orders', (object_id, firecon_id, orders) => {
    return _extends({
        object_id,
        firecon_id
    }, orders);
});

actioner.$add('fire_weapons');
actioner.$add('fire_weapon', (object_id, target_id, weapon_id) => ({
    object_id, target_id, weapon_id
}), {
    object_id: 'string!',
    target_id: 'string!',
    weapon_id: 'integer!'
});

actioner.$add('damage', (object_id, weapon_type, dice, penetrating = false) => _updeep2.default.if(penetrating, { penetrating: true })({ object_id, weapon_type, dice }));

actioner.$add('internal_damage', (object_id, system, dice) => ({
    object_id, system, dice
}));

actioner.$add('assign_weapons_to_firecons');
actioner.$add('assign_weapon_to_firecon', (bogey_id, weapon_id, firecon_id) => ({
    bogey_id, weapon_id, firecon_id
}));

exports.default = actioner;