"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add_parent_action = exports.add_action_id = exports.add_timestamp = undefined;

var _ref;

exports.subactions = subactions;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _actions = require("../actions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const add_timestamp = exports.add_timestamp = (_ref = (store, next, action) => next(_updeep2.default.updateIn('meta.timestamp', new Date().toISOString(), action)), _lodash2.default.curry(_ref));

const add_action_id = exports.add_action_id = () => {
  var _ref5;

  let _id;

  const next_id = getState => {
    if (!_id) {
      var _ref2, _ref3, _ref4, _getState;

      _id = (_ref2 = (_ref3 = (_ref4 = (_getState = getState(), _fp2.default.get('log')(_getState)), _fp2.default.map('meta.id')(_ref4)), _fp2.default.filter(_lodash2.default.identity)(_ref3)), _fp2.default.max(_ref2)) || 0;
    }

    return ++_id;
  };

  return _ref5 = function ({
    getState,
    dispatch
  }, next, action) {
    if (action.type === _actions.INC_ACTION_ID) return next(action);
    return next(_updeep2.default.updateIn('meta.id', next_id(getState))(action));
  }, _lodash2.default.curry(_ref5);
};

const add_parent_action = exports.add_parent_action = () => {
  var _ref6;

  let stack = [];
  return _ref6 = function ({
    getState
  }, next, action) {
    if (action.type === _actions.PUSH_ACTION_STACK) {
      stack.unshift(action.parent_id);
      return;
    }

    if (action.type === _actions.POP_ACTION_STACK) {
      stack.shift();
      return;
    }

    return next(_updeep2.default.if(stack.length, _updeep2.default.updateIn('meta.parent_action_id', stack[0]))(action));
  }, _lodash2.default.curry(_ref6);
};

function subactions(dispatch, action, inner) {
  let parent_id = _lodash2.default.get(action, 'meta.id');

  if (!parent_id) return inner();
  dispatch((0, _actions.push_action_stack)(parent_id));
  inner();
  dispatch((0, _actions.pop_action_stack)());
}