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

const redact = (0, _utils.redactor)();

redact.EXECUTE_WEAPON_ORDERS = ({
  orders
}) => (0, _updeep2.default)(orders);

exports.default = (0, _utils.actions_reducer)(redact);