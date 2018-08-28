"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mw_compose = exports.subactions = exports.mw_for = undefined;

var _ref, _ref2, _ref3;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _actions = require("../actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:mw:utils');

const mw_for = exports.mw_for = (_ref = function (target, inner) {
  debug("here");
  return _lodash2.default.curry(function (store, next, action) {
    let func = next;

    if (action.type === target) {
      func = inner(store)(next);
    }

    return func(action);
  });
}, _lodash2.default.curry(_ref));
const subactions = exports.subactions = (_ref2 = (inner, store, next, action) => {
  next(action);

  let parent_id = _lodash2.default.get(action, 'meta.id');

  if (parent_id) store.dispatch((0, _actions.push_action_stack)(parent_id));
  inner(store)(next)(action);
  if (parent_id) store.dispatch((0, _actions.pop_action_stack)());
}, _lodash2.default.curry(_ref2));
const mw_compose = exports.mw_compose = (_ref3 = (mws, store, next) => mws.reduceRight((next, mw) => mw(store)(next), next), _lodash2.default.curry(_ref3));