"use strict";

var _utils = require("./utils");

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('combine_reducers', () => {
  let r1 = (state, action) => ({
    a: action.payload
  });

  let r2 = (state, action) => action.payload + 1;

  let bigr = (0, _utils.combine_reducers)({
    r1,
    r2
  });

  const debug = require('debug')('aotds:utils');

  expect(bigr({}, {
    payload: 3
  })).toMatchObject({
    "r1": {
      a: 3
    },
    "r2": 4
  });
});
test('order of pipe_reducers', () => {
  let r1 = (state, action) => 3 * state;

  let r2 = (state, action) => state * action;

  let bigr = (0, _utils.pipe_reducers)([(0, _utils.init_reducer)(1), r1, r2]);
  expect(bigr(undefined, 7)).toEqual(21);
});
test('map_reducer', () => {
  let item_reducer = (state, action) => (0, _updeep2.default)({
    sum: s => s + 1
  })(state);

  let state = [{
    id: 0,
    sum: 0
  }, {
    id: 1,
    sum: 0
  }, {
    id: 2,
    sum: 0
  }];
  let mapped = (0, _utils.mapping_reducer)(item_reducer);
  let match_id = mapped(({
    id
  }) => _lodash2.default.matches({
    id
  }));
  let main_reducer = (0, _utils.actions_reducer)({
    DO_IT: mapped(a => _lodash2.default.matches({
      id: a.id
    })),
    DO_IT_TOO: match_id,
    DO_IT_ALL: mapped(true)
  });
  state = main_reducer(state, {
    type: 'DO_IT',
    id: 4
  });
  expect(state).toEqual(expect.arrayContaining([{
    id: 0,
    sum: 0
  }, {
    id: 1,
    sum: 0
  }, {
    id: 2,
    sum: 0
  }]));
  state = main_reducer(state, {
    type: 'DO_IT',
    id: 1
  });
  expect(state).toEqual(expect.arrayContaining([{
    id: 0,
    sum: 0
  }, {
    id: 1,
    sum: 1
  }, {
    id: 2,
    sum: 0
  }]));
  state = main_reducer(state, {
    type: 'DO_IT',
    id: 0
  });
  expect(state).toEqual(expect.arrayContaining([{
    id: 0,
    sum: 1
  }, {
    id: 1,
    sum: 1
  }, {
    id: 2,
    sum: 0
  }]));
  state = main_reducer(state, {
    type: 'DO_IT_TOO',
    id: 2
  });
  expect(state).toEqual(expect.arrayContaining([{
    id: 2,
    sum: 1
  }]));
  state = main_reducer(state, {
    type: 'DO_IT_ALL'
  });
  expect(state).toEqual(expect.arrayContaining([{
    id: 0,
    sum: 2
  }, {
    id: 1,
    sum: 2
  }, {
    id: 2,
    sum: 2
  }]));
});