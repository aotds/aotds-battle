'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _utils = require('./utils');

var reducer = {};


reducer['@@redux/INIT'] = function (state) {
    return state;
};
reducer['*'] = function (state, action) {
    return state.concat(action);
};

exports.default = (0, _utils.actionsHandler)(reducer, []);