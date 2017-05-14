"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Redux = require("redux");
var Reducer_1 = require("./Reducer");
var Actions_1 = require("./Actions");
var Ajv = require("ajv");
var Schema_1 = require("./Schema");
;
var Battle = (function () {
    function Battle(options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        this.init_game = function (payload) { return _this.store.dispatch(Actions_1.default.init_game(payload)); };
        this.store = Redux.createStore(Reducer_1.default, options.state || {});
        // TODO only check for the schema in dev mode
        var ajv = new Ajv();
        ajv.addSchema(Actions_1.default.$schema);
        var schema_validator = ajv.compile(Schema_1.default);
        this.store.subscribe(function () {
            if (!schema_validator(_this.store.getState())) {
                throw schema_validator.errors;
            }
        });
    }
    Object.defineProperty(Battle.prototype, "state", {
        get: function () { return this.store.getState(); },
        enumerable: true,
        configurable: true
    });
    return Battle;
}());
exports.default = Battle;
;
