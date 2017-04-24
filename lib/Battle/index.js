"use strict";
exports.__esModule = true;
var Redux = require("redux");
var battle_reducer = function () { };
var Battle = (function () {
    function Battle(options) {
        if (options === void 0) { options = {}; }
        this.init_game = function (options) { return null; };
        this.store = Redux.createStore(battle_reducer, options.state || {});
    }
    Object.defineProperty(Battle.prototype, "state", {
        get: function () { return this.store.state; },
        enumerable: true,
        configurable: true
    });
    return Battle;
}());
exports["default"] = Battle;
;
