import tap from 'tap';

import dux from '.';

const store = dux.createStore();

store.dispatch(
    store.actions.init_game({
        game: {
            name: 'Gemini',
        },
        ships: [{ id: 1 }, { id: 2 }],
    }),
);

tap.match( store.getState(), {
    game: {
        name: 'Gemini',
        turn: 0,
    }
}, 'game has been initialized');

tap.equal( store.getState().ships.length, 2, 'we have two ships' );
