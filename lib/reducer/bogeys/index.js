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

var _actions = require("../../actions");

var _utils = require("../utils");

var _bogey = require("./bogey");

var _bogey2 = _interopRequireDefault(_bogey);

var _inflate = require("./inflate");

var _inflate2 = _interopRequireDefault(_inflate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:bogeys');

const default_selector = action => _fp2.default.matchesProperty('id', action.object_id);

const only_target_object = (selector = default_selector) => action => {
  return _updeep2.default.map(_updeep2.default.if(selector(action), obj => object_reducer(obj, action)));
};

let redaction = (0, _utils.redactor)();

redaction.PLAY_TURN = action => _updeep2.default.omitBy(_updeep2.default.is('structure.destroyed', true));

redaction.INTERNAL_DAMAGE = only_target_object();

redaction.INIT_GAME = action => () => {
  var _$get;

  return _$get = _lodash2.default.get(action, 'bogeys', {}), (0, _inflate2.default)(_$get);
};

const specific_bogey = action => _updeep2.default.updateIn(action.bogey_id, b => (0, _bogey2.default)(b, action));

['SET_ORDERS', 'BOGEY_MOVEMENT', 'EXECUTE_FIRECON_ORDERS', 'EXECUTE_WEAPON_ORDERS', 'DAMAGE', 'INTERNAL_DAMAGE'].forEach(action => redaction[action] = specific_bogey);

redaction.CLEAR_ORDERS = action => _updeep2.default.map(b => (0, _bogey2.default)(b, action));

exports.default = (0, _utils.actions_reducer)(redaction, {});