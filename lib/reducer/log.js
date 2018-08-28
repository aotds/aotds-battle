"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ref, _ref2;

exports.tree_log = tree_log;
exports.default = log_reducer;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _actions = require("../actions");

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const unwanted_actions = ['@@redux/INIT', _actions.INC_ACTION_ID, _actions.PUSH_ACTION_STACK, _actions.POP_ACTION_STACK];

const _log_reduce = (_ref = function (action, parents, state) {
  let id = _lodash2.default.head(parents);

  if (!id) {
    return [...state, action];
  }

  ;
  return _updeep2.default.map(_updeep2.default.if(_updeep2.default.is('meta.id', id), (0, _updeep2.default)({
    meta: {
      child_actions: s => _log_reduce(action, _lodash2.default.tail(parents), s || [])
    }
  })))(state);
}, _lodash2.default.curry(_ref));

const add_tree_branch = (_ref2 = (parent_id, action, root) => {
  if (_lodash2.default.get(root, 'meta.id') === parent_id) {
    return _updeep2.default.updateIn('meta.child_actions', s => s ? [...s, action] : [action])(root);
  }

  if (!root.meta.child_actions) throw new Error("logs are out of whack");
  let i = root.meta.child_actions.length - 1;
  return _updeep2.default.updateIn(`meta.child_actions.${i}`, add_tree_branch(parent_id, action))(root);
}, _lodash2.default.curry(_ref2));

function tree_log(log) {
  let tree = [];
  log.forEach(l => {
    const parent_id = _lodash2.default.get(l, 'meta.parent_action_id');

    if (!parent_id) {
      tree = (0, _updeep2.default)(t => [...t, l])(tree);
    } else {
      tree = _updeep2.default.updateIn(tree.length - 1, add_tree_branch(parent_id, l))(tree);
    }
  });
  return tree;
}

const debug = require('debug')('aotds:reducer:log');

function log_reducer(state = [], action) {
  if (_lodash2.default.includes(unwanted_actions, action.type)) return state;
  return [...state, action];
}