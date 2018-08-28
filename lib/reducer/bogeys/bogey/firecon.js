"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _actions = require("../../../actions");

var _actions2 = _interopRequireDefault(_actions);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const redact = (0, _utils.redactor)();

redact.EXECUTE_FIRECON_ORDERS = action => (0, _updeep2.default)(f => _extends({
  id: f.id
}, action.orders));

exports.default = (0, _utils.actions_reducer)(redact);