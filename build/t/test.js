"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = require("../lib/Logger");
var AotdsType = (function () {
    function AotdsType() {
        this.type = Object.getPrototypeOf(this).constructor.name.toUpperCase();
    }
    return AotdsType;
}());
var Foo = (function (_super) {
    __extends(Foo, _super);
    function Foo() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Foo.prototype, "thingy", {
        get: function () {
            return "stuff";
        },
        enumerable: true,
        configurable: true
    });
    return Foo;
}(AotdsType));
var x = new Foo();
Logger_1.default.level = 'debug';
Logger_1.default.debug("got it", x.thingy);
//console.log( Foo.type );
