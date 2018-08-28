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

var _inflate = require("./bogeys/inflate");

var _inflate2 = _interopRequireDefault(_inflate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _updeep2.default)({
  bogeys: _inflate2.default
});