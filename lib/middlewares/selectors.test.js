'use strict';

var _selectors = require('./selectors');

test('players_not_done', () => {
    let state = {
        game: {
            players: [{ id: 'yanick' }, { id: 'yenzie' }, { id: 'bob', status: 'inactive' }]
        },
        objects: [{ id: 'gilga', player_id: 'bob' }, { id: 'enkidu', player_id: 'yanick', orders: { done: true } }, { id: 'siduri', player_id: 'yenzie' }, { id: 'rando' }]
    };

    expect((0, _selectors.players_not_done)(state)).toEqual(['yenzie']);
});