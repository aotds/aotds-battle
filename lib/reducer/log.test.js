"use strict";

var _log = require("./log");

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('logs', () => {
  var _state;

  let state = (0, _log2.default)(undefined, {
    type: 'STUFF',
    meta: {
      id: 123
    }
  });
  state = (0, _log2.default)(state, {
    type: 'FOO',
    meta: {
      id: 124,
      parent_action_id: 123
    }
  });
  state = (0, _log2.default)(state, {
    type: 'BAR',
    meta: {
      id: 125
    }
  });
  expect(state).toMatchSnapshot('state');
  expect((_state = state, (0, _log.tree_log)(_state))).toMatchSnapshot('tree');
});