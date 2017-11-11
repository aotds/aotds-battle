'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Actions = require('../Actions');

var A = _interopRequireWildcard(_Actions);

require('../Types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducer = {};


reducer.INIT_GAME = function (state, action) {
    if (action.payload.objects) return state.concat(action.payload.objects);

    return state;
};

var single_object = function single_object(action, update) {
    return _updeep2.default.map(_updeep2.default.if(_updeep2.default.is('id', action.payload.object_id), update));
};

reducer.MOVE_OBJECT = function (state, action) {
    return single_object(action, { navigation: action.payload.navigation })(state);
};

exports.default = (0, _utils.actionsHandler)(reducer, []);