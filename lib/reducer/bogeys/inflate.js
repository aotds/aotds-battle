"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _inflate = require("./bogey/inflate");

var _inflate2 = _interopRequireDefault(_inflate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _fp2.default.flow([_updeep2.default.if(_lodash2.default.isArray, a => _lodash2.default.keyBy(a, 'id')), _updeep2.default.map(_inflate2.default)]);