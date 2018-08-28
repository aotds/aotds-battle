"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subactions = subactions;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _effects = require("redux-saga/effects");

var _actions = require("../../actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* subactions(action, inner) {
  let parent_id = _lodash2.default.get(action, 'meta.id');

  if (parent_id) yield (0, _effects.put)((0, _actions.push_action_stack)(parent_id));
  yield* inner();
  if (parent_id) yield (0, _effects.put)((0, _actions.pop_action_stack)());
}