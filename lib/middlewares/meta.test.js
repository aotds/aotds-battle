"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _actions = require("../actions");

var _meta = require("./meta");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('timestamp', () => {
  let result = (0, _meta.add_timestamp)(null, x => x, {});
  expect(result).toHaveProperty('meta.timestamp');
  expect(result.meta.timestamp).not.toBeUndefined();
  expect(result.meta.timestamp).toMatch(/\d{4}-\d{2}-\d{2}/);
});
test('add_action_id', () => {
  let mw = (0, _meta.add_action_id)();
  let getState = jest.fn();
  getState.mockReturnValue({
    log: [{
      meta: {
        id: 3
      }
    }]
  });
  let next = jest.fn();
  mw({
    getState
  }, next, {
    type: 'STUFF'
  });
  expect(getState).toHaveBeenCalledTimes(1);
  expect(next).toHaveBeenCalledWith({
    type: 'STUFF',
    meta: {
      id: 4
    }
  });
});
test('parent_action_id', () => {
  let mw = (0, _meta.add_parent_action)();
  let next = jest.fn();
  mw({}, next, {
    type: 'STUFF'
  });
  expect(next).toHaveBeenCalledWith({
    type: 'STUFF'
  });
  next.mockClear();
  mw({}, next, {
    type: 'PUSH_ACTION_STACK',
    parent_id: 3
  });
  expect(next).not.toHaveBeenCalled();
  mw({}, next, {
    type: 'STUFF'
  });
  expect(next).toHaveBeenCalledWith({
    type: 'STUFF',
    meta: {
      parent_action_id: 3
    }
  });
  next.mockClear();
  mw({}, next, {
    type: 'POP_ACTION_STACK'
  });
  expect(next).not.toHaveBeenCalled();
  mw({}, next, {
    type: 'STUFF'
  });
  expect(next).toHaveBeenCalledWith({
    type: 'STUFF'
  });
});