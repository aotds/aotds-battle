'use strict';

var _tap = require('tap');

var _tap2 = _interopRequireDefault(_tap);

var _ = require('.');

var _2 = _interopRequireDefault(_);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Logger2.default.level = 'trace';

var battle = new _2.default();

_tap2.default.same(battle.state, { log: [], game: { turn: 0 }, objects: [] }, 'initial state');

_tap2.default.pass('so far, so good');

battle.init({
    name: 'Epsilon 7',
    objects: [{ id: 'enkidu', coords: [0, 0], velocity: 3, heading: 0 }, { id: 'siduri', coords: [1, 1], velocity: 3, heading: 0 }]
});

_tap2.default.includes(battle.state, {
    game: { turn: 0, name: 'Epsilon 7' },
    objects: [{ id: 'enkidu', coords: [0, 0] }]
}, 'initial state');

battle.dispatch_action('PLAY_MOVE_OBJECT', { object_id: 'enkidu' });

_tap2.default.includes(battle.state, {
    objects: [{ id: 'enkidu', coords: [3, 0] }]
}, 'ship moved');