'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.internal_damage = exports.calculate_damage = exports.execute_firecon_orders = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _weapons = require('../../weapons');

var weapons = _interopRequireWildcard(_weapons);

var _utils = require('../utils');

var _actions = require('../../actions');

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require('../selectors');

var _dice = require('../../dice');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:mw');

const fire_weapons = (0, _utils.mw_for)(_actions2.default.FIRE_WEAPONS, ({ getState, dispatch }) => next => action => {
    next(action);

    getState().objects.forEach(obj => {
        _fp2.default.getOr([])('weaponry.firecons')(obj).filter(f => f.target_id).forEach(firecon => {
            _fp2.default.getOr([])('weaponry.weapons')(obj).filter(w => w.firecon_id === firecon.id).forEach(w => {
                dispatch(_actions2.default.fire_weapon(obj.id, firecon.target_id, w.id));
            });
        });
    });
});

const fire_weapon = (0, _utils.mw_for)(_actions2.default.FIRE_WEAPON, ({ getState, dispatch }) => next => action => {

    let { object_id, target_id, weapon_id } = action;

    let state = getState();
    let object = (0, _selectors.get_object_by_id)(state, object_id);
    let target = (0, _selectors.get_object_by_id)(state, target_id);
    let weapon = _fp2.default.find({ id: weapon_id })(_fp2.default.getOr([])('weaponry.weapons')(object));

    if (object && target && weapon) {
        action = (0, _updeep2.default)(weapons.fire_weapon(object, target, weapon))(action);
        next(action);
    }
});

const execute_firecon_orders = exports.execute_firecon_orders = (0, _utils.mw_for)(_actions2.default.EXECUTE_FIRECON_ORDERS, ({ getState, dispatch }) => next => action => {
    next(action);

    let transform = _fp2.default.pipe([_fp2.default.getOr([])('objects'), _fp2.default.map(obj => ({ object_id: obj.id, firecons: _fp2.default.get('orders.firecons')(obj) })), _fp2.default.filter(_fp2.default.get('firecons')), _fp2.default.map(({ object_id, firecons }) => firecons.map(f => [object_id, f.firecon_id, _fp2.default.omit('firecon_id')(f)])), _fp2.default.flatten, _fp2.default.map(o => dispatch(_actions2.default.execute_ship_firecon_orders(...o)))]);

    let x = transform(getState());
});

// must be after 'fire_weapon' to intercept the
// damage done

// check if damage_dice and/or penetrating_damage_dice
// if there is any, send the DAMAGE
const weapon_damages = (0, _utils.mw_for)(_actions2.default.FIRE_WEAPON, ({ getState, dispatch }) => next => action => {
    next(action);

    let object = (0, _selectors.get_object_by_id)(getState(), action.object_id);
    let weapon = _fp2.default.find({ id: action.weapon_id })(_fp2.default.getOr([])('weaponry.weapons')(object));

    let damage_dispatch = ([dice, penetrating]) => dispatch(_actions2.default.damage(action.target_id, weapon.type, dice, penetrating));

    [['damage_dice', false], ['penetrating_damage_dice', true]].map((0, _updeep2.default)({ 0: x => action[x] })).filter(x => x[0]).forEach(damage_dispatch);
});

const ship_max_shield = _fp2.default.pipe(_fp2.default.getOr([])('structure.shields'), _fp2.default.map('level'), _fp2.default.max);

const calculate_damage = exports.calculate_damage = (0, _utils.mw_for)(_actions2.default.DAMAGE, ({ getState, dispatch }) => next => action => {
    let ship = (0, _selectors.get_object_by_id)(getState(), action.object_id);

    let damage_table = { 4: 1, 5: 1, 6: 2 };

    if (!action.penetrating) {
        let shield = ship_max_shield(ship);

        damage_table = _fp2.default.pipe(_updeep2.default.if(shield, { 4: 0 }), _updeep2.default.if(shield == 2, { 6: 1 }))(damage_table);
    }

    action = (0, _updeep2.default)({
        damage: _fp2.default.sumBy(v => damage_table[v] || 0)(action.dice)
    })(action);

    next(action);
});

function internal_damage_drive(ship, percent) {
    if (!ship.drive) return;

    let damage = _fp2.default.getOr(0)('drive.damage_level')(ship);

    debug(damage);
    if (damage >= 2) return;

    let roll = (0, _dice.roll_die)(100);
    debug(roll);

    if (roll > percent) return;

    return {
        type: 'drive',
        dice: { rolled: roll, target: percent }
    };
}

function internal_damage_firecons(ship, percent) {
    let firecons = _fp2.default.reject('damaged')(_fp2.default.getOr([])('weaponry.firecons')(ship)).map(_fp2.default.pick('id')).map(f => _extends({}, f, { dice: { target: percent, rolled: (0, _dice.roll_die)(100) }, type: 'firecon' })).filter(f => f.dice.rolled <= percent);

    return firecons;
}

function internal_damage_weapons(ship, percent) {
    let weapons = _fp2.default.reject('damaged')(_fp2.default.getOr([])('weaponry.weapons')(ship)).map(_fp2.default.pick('id')).map(f => _extends({}, f, { dice: { target: percent, rolled: (0, _dice.roll_die)(100) }, type: 'weapon' })).filter(f => f.dice.rolled <= percent);

    return weapons;
}

const assign_weapons_to_firecons = (0, _utils.mw_for)(_actions2.default.ASSIGN_WEAPONS_TO_FIRECONS, ({ getState, dispatch }) => next => action => {
    _fp2.default.getOr([])('objects')(getState()).forEach(bogey => {
        let orders = _fp2.default.getOr([])('orders.weapons')(bogey);
        orders.forEach(order => {
            dispatch(_actions2.default.assign_weapon_to_firecon(bogey.id, order.weapon_id, order.firecon_id));
        });
    });
});

function internal_damage_shields(ship, percent) {
    let weapons = _fp2.default.reject('damaged')(_fp2.default.getOr([])('structure.shields')(ship)).map(_fp2.default.pick('id')).map(f => _extends({}, f, { dice: { target: percent, rolled: (0, _dice.roll_die)(100) }, type: 'shield' })).filter(f => f.dice.rolled <= percent);

    return weapons;
}

const internal_damage = exports.internal_damage = (0, _utils.mw_for)(_actions2.default.DAMAGE, ({ getState, dispatch }) => next => action => {
    let ship = () => (0, _selectors.get_object_by_id)(getState(), action.object_id);

    let before = _fp2.default.get('structure.hull')(ship());
    next(action);

    ship = ship();
    let after = _fp2.default.get('structure.hull')(ship);

    // no damage? nothing to do
    if (before === after) return;

    let { current: previous_hull } = before;
    let { current, max } = after;

    let damage = previous_hull - current;

    let probability = parseInt(100 * damage / max);

    debug(probability);

    let damaged = [internal_damage_drive, internal_damage_firecons, internal_damage_weapons, internal_damage_shields].map(f => f(ship, probability)).filter(x => x).reduce((accum, b) => accum.concat(b), []).map(d => _actions2.default.internal_damage(ship.id, _fp2.default.omit('dice')(d), d.dice));

    debug(damaged);

    damaged.forEach(dispatch);

    return damaged;

    // TODO: repair crews

    // TODO: core systems
});

let middlewares = [assign_weapons_to_firecons, fire_weapons, fire_weapon, execute_firecon_orders, weapon_damages, calculate_damage, internal_damage];
exports.default = middlewares;