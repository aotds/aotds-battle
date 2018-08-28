'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _durationJs = require('duration-js');

var _durationJs2 = _interopRequireDefault(_durationJs);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:reducer:game');

let redact = {};

redact.INIT_GAME = ({ game }) => (0, _updeep2.default)(_fp2.default.pick(['name', 'players', 'turn_times'])(game));

redact.PLAY_TURN = ({ timestamp }) => state => (0, _updeep2.default)({ turn_times: _updeep2.default.ifElse(_fp2.default.has('max'), t => {
        let started = Date.parse(t.started);
        debug(started);
        let max = new _durationJs2.default(t.max);
        let later = new Date(started + max);
        return _extends({}, t, { deadline: later.toISOString() });
    }, _updeep2.default.omit(['deadline'])) })((0, _updeep2.default)({
    turn: t => t + 1,
    turn_times: {
        started: timestamp
    }
})(state));

const original_state = {
    turn: 0
};

exports.default = (0, _utils.actions_reducer)(redact, original_state);