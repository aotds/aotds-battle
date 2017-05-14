"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_actions_1 = require("redux-actions");
var Actions_1 = require("./Actions");
var Log_1 = require("./Reducer/Log");
var objects = redux_actions_1.handleActions((_a = {},
    _a[Actions_1.default.INIT_GAME] = function (state, _a) {
        var objects = _a.objects;
        return objects.slice();
    },
    _a), []);
var game = redux_actions_1.handleActions((_b = {},
    _b[Actions_1.default.INIT_GAME] = function (state, _a) {
        var name = _a.name;
        return ({ name: name });
    },
    _b), {});
var reducer = redux_1.combineReducers({ log: Log_1.default, objects: objects, game: game });
exports.default = reducer;
var _a, _b;
