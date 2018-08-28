"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _inflate = require("./structure/inflate");

var _inflate2 = _interopRequireDefault(_inflate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const firecons = _updeep2.default.if(_fp2.default.isNumber, _fp2.default.flow(_fp2.default.times(_fp2.default.add(1)), _fp2.default.keyBy(_lodash2.default.identity), _updeep2.default.map(id => ({
  id
}))));

const weapons = _updeep2.default.if(_fp2.default.isArray, _fp2.default.flow(_fp2.default.entries, _fp2.default.map(([i, w]) => [1 + parseInt(i), _extends({
  id: 1 + parseInt(i)
}, w)]), _fp2.default.fromPairs));

const drive = _updeep2.default.if(_fp2.default.isNumber, max => ({
  max,
  current: max
}));

exports.default = (0, _updeep2.default)({
  drive,
  structure: _inflate2.default,
  weaponry: {
    firecons,
    weapons
  }
});