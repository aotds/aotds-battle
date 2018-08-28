"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inflate;

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const shields = _updeep2.default.if(_fp2.default.isArray, _lodash2.default.flow(_updeep2.default.map((level, id) => ({
  id: id + 1,
  level
})), _fp2.default.keyBy('id')));

function inflate(state) {
  let inflate_hull = x => typeof x === 'number' ? {
    current: x,
    max: x
  } : x;

  let i = 1;
  return (0, _updeep2.default)({
    hull: inflate_hull,
    armor: inflate_hull,
    shields
  })(state);
}