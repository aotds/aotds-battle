'use strict';

var _index = require('./index');

const debug = require('debug')('aotds:reducer:test');
debug.inspectOpts.depth = 99;

test('inflate', () => {

    let inflated = (0, _index.inflate)({
        game: {},
        objects: [{
            drive: 3,
            structure: { shields: [1, 1, 2] },
            weaponry: { firecons: 2 }
        }]
    });

    let ship = inflated.objects[0];

    expect(ship.structure.shields[0]).toMatchObject({
        id: 1, level: 1
    });

    expect(ship.weaponry).toMatchObject({
        firecons: [{ id: 1 }, { id: 2 }]
    });

    expect(ship.drive).toMatchObject({
        max: 3,
        current: 3
    });
});