'use strict';

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _reduxMockStore = require('redux-mock-store');

var _reduxMockStore2 = _interopRequireDefault(_reduxMockStore);

var _index = require('./index.js');

var _index2 = _interopRequireDefault(_index);

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _selectors = require('./selectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:battle:test');

const mockStore = (0, _reduxMockStore2.default)([_index.objects_movement_phase]);

test('move objects', () => {
    let store = mockStore({
        objects: [{ id: 'enkidu', navigation: {} }, { id: 'siduri', navigation: {} }]
    });

    store.dispatch(_actions2.default.move_objects());

    expect(store.getActions()).toMatchObject([_actions2.default.move_objects()].concat(['enkidu', 'siduri'].map(_actions2.default.move_object)));
});

test('move object without orders', () => {

    let mockStore = (0, _reduxMockStore2.default)(_index2.default);
    let store = mockStore({ objects: [{
            id: 'enkidu',
            navigation: {
                heading: 1,
                coords: [1, 2],
                velocity: 5
            }
        }] });

    store.dispatch(_actions2.default.move_object('enkidu'));

    let move = store.getActions()[0];

    const round = x => _lodash2.default.round(x, 1);
    const roundup_navigation = (0, _updeep2.default)({
        coords: _updeep2.default.map(round),
        trajectory: _updeep2.default.map((0, _updeep2.default)({
            coords: _updeep2.default.map(round),
            delta: _updeep2.default.map(round)
        }))
    });

    move = (0, _updeep2.default)({ navigation: roundup_navigation })(move);

    expect(move).toMatchObject({
        object_id: 'enkidu',
        navigation: {
            heading: 1,
            velocity: 5,
            coords: [3.5, 6.3],
            trajectory: [{ type: 'POSITION', coords: [1, 2] }, { type: 'MOVE', delta: [2.5, 4.3] }]
        }
    });
});