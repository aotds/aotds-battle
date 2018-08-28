"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculate_damage = undefined;

var _ref, _ref2;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _actions = require("../actions");

var _damages = require("../rules/damages");

var rules = _interopRequireWildcard(_damages);

var _selectors = require("./selectors");

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const calculate_damage = exports.calculate_damage = (_ref = (_ref2 = function ({
  getState,
  dispatch
}, next, action) {
  var _getState;

  let bogey = (_getState = getState(), (0, _selectors.get_bogey)(action.bogey_id)(_getState));
  next((0, _updeep2.default)({
    damage: rules.calculate_damage(_extends({
      bogey
    }, action))
  }, action));
}, _lodash2.default.curry(_ref2)), (0, _utils.mw_for)(_actions.DAMAGE)(_ref));