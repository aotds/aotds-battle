"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.crossProduct = undefined;

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const crossProduct = (...rest) => _fp2.default.reduce((a, b) => _fp2.default.flatMap(x => _fp2.default.map(y => x.concat([y]))(b))(a))([[]])(rest);

exports.crossProduct = crossProduct;