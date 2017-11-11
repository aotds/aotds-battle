'use strict';

var _tap = require('tap');

var _tap2 = _interopRequireDefault(_tap);

var _Log = require('./Log');

var _Log2 = _interopRequireDefault(_Log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var action_foo = { type: 'FOO', payload: { something: true } };

_tap2.default.same((0, _Log2.default)(undefined, action_foo), [action_foo]);

_tap2.default.same((0, _Log2.default)(undefined, { type: '@@redux/INIT' }), [], 'skip @@redux/INIT');