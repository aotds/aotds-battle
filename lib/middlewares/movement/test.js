"use strict";

var _actions = require("../../actions");

var _index = require("./index");

var _selectors = require("../selectors");

var selectors = _interopRequireWildcard(_selectors);

var _movement = require("../../movement");

var movement_logic = _interopRequireWildcard(_movement);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const debug = require('debug')('aotds');

const mock_mw_args = () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn()
  },
  next: jest.fn()
});

test('movement_phase on other actions', () => {
  let mocked = mock_mw_args();
  (0, _index.movement_phase)(mocked.store, mocked.next, {
    type: 'OTHER'
  });
  expect(mocked.store.getState).not.toHaveBeenCalled();
});
test('movement_phase', () => {
  let mocked = mock_mw_args();
  selectors.select = jest.fn(() => () => [{
    id: 'enkidu',
    navigation: true
  }, {
    id: 'siduri',
    navigation: true
  }, {
    id: 'gilgamesh'
  }]);
  (0, _index.movement_phase)(mocked.store, mocked.next, _actions.actions.movement_phase());
  expect(mocked.store.getState).toHaveBeenCalled();
  expect(mocked.store.dispatch).toHaveBeenCalledTimes(2);
  expect(mocked.store.dispatch).nthCalledWith(1, _actions.actions.bogey_movement('enkidu'));
  expect(mocked.store.dispatch).nthCalledWith(2, _actions.actions.bogey_movement('siduri'));
});
test('bogey_movement', () => {
  let mocked = mock_mw_args();
  selectors.select = jest.fn(() => () => ({
    id: 'enkidu'
  }));
  movement_logic.plot_movement = jest.fn(() => 'worked');
  (0, _index.bogey_movement)(mocked.store, mocked.next, _actions.actions.bogey_movement('enkidu'));
  expect(mocked.store.getState).toHaveBeenCalled();
  expect(mocked.store.dispatch).not.toHaveBeenCalled();
  expect(mocked.next).toHaveBeenCalledWith({
    type: 'BOGEY_MOVEMENT',
    bogey_id: 'enkidu',
    navigation: 'worked'
  });
});