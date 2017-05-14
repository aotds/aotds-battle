"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tap = require("tap");
var battle_1 = require("../lib/battle");
var Logger_1 = require("../lib/Logger");
Logger_1.default.level = 'debug';
tap.test('create battle', function (tap) {
    var battle = new battle_1.default();
    battle.init_game({
        name: 'gemini',
        objects: [
            { name: 'Enkidu' },
            { name: 'Siduri' },
        ],
    });
    var state = battle.state;
    tap.same(state.game, { name: 'gemini' }, 'game');
    tap.same(state.objects, [
        { name: 'Enkidu' },
        { name: 'Siduri' }
    ], 'objects');
    tap.end();
});
var Schema_1 = require("../lib/battle/Schema");
console.log(JSON.stringify(Schema_1.default));
