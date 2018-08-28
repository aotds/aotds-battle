"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.weapon_firing_phase = exports.weapon_orders_phase = exports.firecon_orders_phase = exports.internal_damage_check = undefined;

var _ref10, _ref11, _ref12, _ref13, _ref14, _ref27, _ref28, _ref29, _ref35, _ref36, _ref37, _ref49, _ref50, _ref51;

exports.bogey_firing_actions = bogey_firing_actions;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _utils = require("../../utils");

var _actions = require("../../actions");

var _dice = require("../../dice");

var _selectors = require("../selectors");

var _utils2 = require("../utils");

var _weapons2 = require("../../weapons");

var weapons = _interopRequireWildcard(_weapons2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const debug = require('debug')('aotds:mw:weapons');

const spy = thingy => {
  debug(thingy);
  return thingy;
};

const internal_damage_check = exports.internal_damage_check = (0, _utils2.mw_for)('DAMAGE', store => next => action => {
  var _ref, _store$getState;

  let before = (_ref = (_store$getState = store.getState(), (0, _selectors.get_bogey)(action.bogey_id)(_store$getState)), _fp2.default.get('structure.hull.current')(_ref));
  (0, _utils2.subactions)(() => () => () => {
    var _store$getState2, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;

    let bogey = (_store$getState2 = store.getState(), (0, _selectors.get_bogey)(action.bogey_id)(_store$getState2));
    let hull = bogey.structure.hull;
    let damage = before - hull.current;
    debug(damage);
    if (!damage) return;
    let probability = parseInt(100 * damage / hull.max);
    let systems = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_ref6 = (_ref7 = [internal_damage_drive, internal_damage_firecons, internal_damage_weapons, internal_damage_shields], _fp2.default.map(f => f(bogey, probability))(_ref7)), _fp2.default.flatten(_ref6)), spy(_ref5)), _fp2.default.filter('dice.hit')(_ref4)), _fp2.default.map(({
      system,
      dice
    }) => _actions.actions.internal_damage(bogey.id, system, dice))(_ref3)), _fp2.default.map(store.dispatch)(_ref2));
  })(store, next, action);
}); //         // TODO: repair crews
//         // TODO: core systems

function roll_against_target(target) {
  let rolled = (0, _dice.roll_die)(100);
  return {
    target,
    rolled,
    hit: rolled <= target
  };
}

function internal_damage_drive({
  drive
}, percent) {
  if (!drive) return;
  let damage = drive.damage_level || 0;
  if (damage >= 2) return; // already kaput

  return {
    system: {
      type: 'drive'
    },
    dice: roll_against_target(percent)
  };
}

function* fire_weapons_phase() {
  let bogeys = yield (0, _selectors.select)(_selectors.get_bogeys);
  yield* bogeys.map(fire_bogey_weapons);
}

function* fire_bogey_weapons(bogey) {
  var _$get;

  let firecons = (_$get = _lodash2.default.get(bogey, 'weaponry.firecons', []), _fp2.default.filter('target_id')(_$get));

  let weapons = _lodash2.default.get(bogey, 'weaponry.weapons', []);

  for (let f of firecons) {
    var _ref8, _ref9, _weapons;

    yield* (_ref8 = (_ref9 = (_weapons = weapons, _fp2.default.filter({
      firecon_id: f.id
    })(_weapons)), _fp2.default.map(({
      id
    }) => _actions.actions.fire_weapon(bogey.id, f.target_id, id))(_ref9)), _fp2.default.map(a => put(a))(_ref8));
  }
}

function* fire_weapon(bogey_id, target_id, weapon_id) {
  let bogey = yield (0, _selectors.select)(_selectors.get_bogey, bogey_id);
  let weapon = bogey.weaponry.weapons[weapon_id];
  let target = yield (0, _selectors.select)(_selectors.get_bogey, target_id);
}

const bogey_fire_weapon = (_ref10 = (_ref11 = function ({
  getState
}, next, action) {
  var _getState, _getState2;

  let {
    bogey_id,
    target_id,
    weapon_id
  } = action;
  let bogey = (_getState = getState(), (0, _selectors.get_bogey)(bogey_id)(_getState));
  let target = (_getState2 = getState(), (0, _selectors.get_bogey)(target_id)(_getState2));

  let weapon = _lodash2.default.get(bogey, 'weaponry.weapons.' + weapon_id);

  next((0, _updeep2.default)(weapons.fire_weapon(bogey, target, weapon))(action));
}, _lodash2.default.curry(_ref11)), (0, _utils2.mw_for)(_actions.BOGEY_FIRE_WEAPON)(_ref10)); // must be after 'fire_weapon' to intercept the
// damage done
// check if damage_dice and/or penetrating_damage_dice
// if there is any, send the DAMAGE 

const weapon_damages = (_ref12 = (_ref13 = (_ref14 = function ({
  getState,
  dispatch
}, next, action) {
  var _getState3, _ref15, _ref16, _$pick;

  let bogey = (_getState3 = getState(), (0, _selectors.get_bogey)(action.bogey_id)(_getState3));
  let weapon = action.weapon;
  _ref15 = (_ref16 = (_$pick = _lodash2.default.pick(action, ['damage_dice', 'penetrating_damage_dice']), _lodash2.default.entries(_$pick)), _fp2.default.map(([type, dice]) => _actions.actions.damage(action.target_id, weapon.type, dice, /penetrating/.test(type)))(_ref16)), _fp2.default.map(dispatch)(_ref15);
}, _lodash2.default.curry(_ref14)), (0, _utils2.subactions)(_ref13)), (0, _utils2.mw_for)(_actions.BOGEY_FIRE_WEAPON)(_ref12));

const roll_system = (type, details, target) => ({
  system: _extends({
    type
  }, details),
  dice: roll_against_target(target)
});

function internal_damage_firecons(ship, percent) {
  var _ref17, _ref18, _ref19, _ref20, _ship;

  return _ref17 = (_ref18 = (_ref19 = (_ref20 = (_ship = ship, _fp2.default.getOr({})('weaponry.firecons')(_ship)), _fp2.default.values(_ref20)), _fp2.default.reject('damaged')(_ref19)), _fp2.default.map('id')(_ref18)), _fp2.default.map(id => roll_system('firecon', {
    id
  }, percent))(_ref17);
}

function internal_damage_weapons(ship, percent) {
  var _ref21, _ref22, _ref23, _ship2;

  return _ref21 = (_ref22 = (_ref23 = (_ship2 = ship, _fp2.default.getOr([])('weaponry.weapons')(_ship2)), _fp2.default.reject('damaged')(_ref23)), _fp2.default.map('id')(_ref22)), _fp2.default.map(id => roll_system('weapon', {
    id
  }, percent))(_ref21);
} // function* assign_weapons_to_firecons() {
//     let bogeys = yield select( get_bogeys );
//     bogeys = bogeys |> fp.filter('orders.weapons');
//     for ( let bogey of bogeys ) {
//         yield* _.get(bogey,'orders.weapons',[]) 
//             |> fp.map( ({ weapon_id, firecon_id }) 
//                 => actions.assign_weapon_to_firecon( bogey.id, weapon_id, firecon_id) )
//             |> fp.map( a => put(a) );
//     }
// }


function internal_damage_shields(ship, percent) {
  var _ref24, _ref25, _ref26, _ship3;

  return _ref24 = (_ref25 = (_ref26 = (_ship3 = ship, _fp2.default.getOr([])('structure.shields')(_ship3)), _fp2.default.reject('damaged')(_ref26)), _fp2.default.map('id')(_ref25)), _fp2.default.map(id => roll_system('shield', {
    id
  }, percent))(_ref24);
}

const firecon_orders_phase = exports.firecon_orders_phase = (_ref27 = (_ref28 = (_ref29 = function ({
  dispatch,
  getState
}, next, action) {
  var _ref30, _ref31, _ref32, _ref33, _ref34, _getState4;

  _ref30 = (_ref31 = (_ref32 = (_ref33 = (_ref34 = (_getState4 = getState(), (0, _selectors.select)(_selectors.get_bogeys)(_getState4)), _fp2.default.filter('orders.firecons')(_ref34)), _fp2.default.map(b => {
    var _b$orders$firecons;

    return (0, _utils.crossProduct)([b.id], (_b$orders$firecons = b.orders.firecons, _fp2.default.entries(_b$orders$firecons)));
  })(_ref33)), _fp2.default.flatten(_ref32)), _fp2.default.map(([id, [firecon_id, orders]]) => _actions.actions.execute_firecon_orders(id, firecon_id, orders))(_ref31)), _fp2.default.map(dispatch)(_ref30);
}, _lodash2.default.curry(_ref29)), (0, _utils2.subactions)(_ref28)), (0, _utils2.mw_for)(_actions.FIRECON_ORDERS_PHASE)(_ref27));
const weapon_orders_phase = exports.weapon_orders_phase = (_ref35 = (_ref36 = (_ref37 = function ({
  dispatch,
  getState
}, next, action) {
  var _ref38, _ref39, _ref40, _ref41, _ref42, _getState5;

  _ref38 = (_ref39 = (_ref40 = (_ref41 = (_ref42 = (_getState5 = getState(), (0, _selectors.select)(_selectors.get_bogeys)(_getState5)), _fp2.default.filter('orders.weapons')(_ref42)), _fp2.default.map(b => {
    var _b$orders$weapons;

    return (0, _utils.crossProduct)([b.id], (_b$orders$weapons = b.orders.weapons, _fp2.default.entries(_b$orders$weapons)));
  })(_ref41)), _fp2.default.flatten(_ref40)), _fp2.default.map(([id, [weapon_id, orders]]) => _actions.actions.execute_weapon_orders(id, weapon_id, orders))(_ref39)), _fp2.default.map(dispatch)(_ref38);
}, _lodash2.default.curry(_ref37)), (0, _utils2.subactions)(_ref36)), (0, _utils2.mw_for)(_actions.WEAPON_ORDERS_PHASE)(_ref35));

function bogey_firing_actions(bogey) {
  var _ref43, _ref44, _bogey, _ref47, _ref48, _firecons;

  let firecons = (_ref43 = (_ref44 = (_bogey = bogey, _fp2.default.getOr({})('weaponry.firecons')(_bogey)), _fp2.default.values(_ref44)), _fp2.default.filter('target_id')(_ref43));

  const weapons_for = firecon_id => {
    var _ref45, _ref46, _bogey2;

    return _ref45 = (_ref46 = (_bogey2 = bogey, _fp2.default.getOr({})('weaponry.weapons')(_bogey2)), _fp2.default.values(_ref46)), _fp2.default.filter({
      firecon_id
    })(_ref45);
  };

  return _ref47 = (_ref48 = (_firecons = firecons, _fp2.default.map(f => (0, _utils.crossProduct)([f.target_id], weapons_for(f.id)))(_firecons)), _fp2.default.flatten(_ref48)), _fp2.default.map(([target_id, {
    id: weapon_id
  }]) => _actions.actions.bogey_fire_weapon(bogey.id, target_id, weapon_id))(_ref47);
}

const weapon_firing_phase = exports.weapon_firing_phase = (_ref49 = (_ref50 = (_ref51 = function ({
  dispatch,
  getState
}, next, action) {
  var _ref52, _ref53, _ref54, _getState6;

  _ref52 = (_ref53 = (_ref54 = (_getState6 = getState(), (0, _selectors.select)(_selectors.get_bogeys)(_getState6)), _fp2.default.map(bogey_firing_actions)(_ref54)), _fp2.default.flatten(_ref53)), _fp2.default.map(dispatch)(_ref52);
}, _lodash2.default.curry(_ref51)), (0, _utils2.subactions)(_ref50)), (0, _utils2.mw_for)(_actions.WEAPON_FIRING_PHASE)(_ref49));
exports.default = [internal_damage_check, firecon_orders_phase, weapon_orders_phase, weapon_firing_phase, bogey_fire_weapon, weapon_damages];