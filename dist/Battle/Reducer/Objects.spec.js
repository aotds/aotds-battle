'use strict';

var _tap = require('tap');

var _tap2 = _interopRequireDefault(_tap);

var _Objects = require('./Objects');

var _Objects2 = _interopRequireDefault(_Objects);

var _Actions = require('../Actions');

var _Actions2 = _interopRequireDefault(_Actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tap2.default.same((0, _Objects2.default)([{ id: 'enkidu' }, { id: 'siduri' }], _Actions2.default.move_object({
    object_id: 'enkidu',
    navigation: {
        coords: [5, 6],
        velocity: 7,
        heading: 8,
        trajectory: []
    }
})), [{
    id: 'enkidu',
    navigation: {
        coords: [5, 6],
        velocity: 7,
        heading: 8,
        trajectory: []
    }
}, { id: 'siduri' }]);