'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _actions = require('../../../actions');

var _actions2 = _interopRequireDefault(_actions);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let debug = require('debug')('aotds:battle:reducer:object:drive');

let reaction = {};

reaction.INTERNAL_DAMAGE = action => state => {
    if (action.system.type !== 'drive') return state;

    return _fp2.default.pipe([(0, _updeep2.default)({ damage_level: l => _fp2.default.isNil(l) ? 1 : l + 1 }), _updeep2.default.if(({ damage_level }) => damage_level === 1, s => _extends({}, s, { current: parseInt(s.rating / 2) })), _updeep2.default.if(({ damage_level }) => damage_level === 2, (0, _updeep2.default)({ current: 0 }))])(state);

    return state;
};

exports.default = (0, _utils.pipe_reducers)([(0, _utils.init_reducer)({}), (0, _utils.actions_reducer)(reaction)]);