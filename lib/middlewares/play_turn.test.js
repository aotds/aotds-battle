"use strict";

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _actions = require("../actions");

var _play_turn = require("./play_turn");

var _play_turn2 = _interopRequireDefault(_play_turn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('play_turn, forced', () => {
  var _ref, _dispatch$mock$calls;

  let getState = jest.fn();
  let dispatch = jest.fn();
  let next = jest.fn();
  (0, _play_turn2.default)({
    getState,
    dispatch
  })(next)(_actions.actions.play_turn(true));
  expect(getState).not.toHaveBeenCalled();
  expect(next).toHaveBeenCalledWith(_actions.actions.play_turn(true));
  expect((_ref = (_dispatch$mock$calls = dispatch.mock.calls, _fp2.default.map('0')(_dispatch$mock$calls)), _fp2.default.map('type')(_ref))).toMatchObject(["MOVEMENT_PHASE", "FIRECON_ORDERS_PHASE", "WEAPON_ORDERS_PHASE", "WEAPON_FIRING_PHASE", "CLEAR_ORDERS"]);
});