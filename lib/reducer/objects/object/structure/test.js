'use strict';

var _index = require('./index');

[[{ damage: 1, penetrating: false }, [10, 1]], [{ damage: 2, penetrating: false }, [9, 1]], [{ damage: 6, penetrating: false }, [6, 0]], [{ damage: 6, penetrating: true }, [4, 2]]].forEach(([action, [hull, armor]]) => test(JSON.stringify(action), () => expect(_index.redact.DAMAGE(action)({ hull: { current: 10 }, armor: { current: 2 } })).toMatchObject({
    hull: { current: hull },
    armor: { current: armor }
})));