"use strict";
exports.__esModule = true;
var tap = require("tap");
var Battle_1 = require("../lib/Battle");
var logger = require("../lib/Logger");
logger.level = 'debug';
console.log(logger);
tap.test('create battle', function (tap) {
    var battle = new Battle_1["default"]();
    battle.init_game({
        name: 'gemini',
        objects: [
            { name: 'Enkidu' },
            { name: 'Siduri' },
        ]
    });
    logger.debug(JSON.stringify(battle.state));
    tap.end();
});
