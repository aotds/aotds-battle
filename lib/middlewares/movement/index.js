"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bogey_movement = exports.movement_phase = undefined;

var _ref, _ref2, _ref3, _ref7, _ref8;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _actions = require("../../actions");

var _movement = require("../../movement");

var _selectors = require("../selectors");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:mw:movement');

const spy = stuff => {
  debug(stuff);
  return stuff;
};

const movement_phase = exports.movement_phase = (_ref = (_ref2 = (_ref3 = function ({
  getState,
  dispatch
}, next, action) {
  var _ref4, _ref5, _ref6, _getState;

  return _ref4 = (_ref5 = (_ref6 = (_getState = getState(), (0, _selectors.select)(_selectors.get_bogeys)(_getState)), _fp2.default.filter('navigation')(_ref6)), _fp2.default.map(bogey => _actions.actions.bogey_movement(bogey.id))(_ref5)), _fp2.default.map(dispatch)(_ref4);
}, _lodash2.default.curry(_ref3)), (0, _utils.subactions)(_ref2)), (0, _utils.mw_for)(_actions.MOVEMENT_PHASE)(_ref));
const bogey_movement = exports.bogey_movement = (_ref7 = (_ref8 = function ({
  getState,
  dispatch
}, next, action) {
  var _getState2;

  let bogey = (_getState2 = getState(), (0, _selectors.select)(_selectors.get_bogey, action.bogey_id)(_getState2));
  next((0, _updeep2.default)({
    navigation: _updeep2.default.constant((0, _movement.plot_movement)(bogey))
  })(action));
}, _lodash2.default.curry(_ref8)), (0, _utils.mw_for)(_actions.BOGEY_MOVEMENT)(_ref7));
exports.default = [movement_phase, bogey_movement];