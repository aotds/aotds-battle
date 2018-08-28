'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.object_by_id = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const object_by_id = exports.object_by_id = (store, id) => _lodash2.default.find(store.objects, { id });