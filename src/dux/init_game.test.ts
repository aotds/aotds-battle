import tap from 'tap';
import dux from '.';

const store = dux.createStore();

tap.test('init_game', async(t) => {
    store.dispatch(
        store.actions.init_game({
            game: {
                name: 'Gemini',
            },
            bogeys: [{ id: "1" }, { id: "2" }],
        }),
    );

    t.match(store.getState(),
    {
        game: {
            name: 'Gemini',
            turn: 0,
        },
    });

    t.equal(store.getState().bogeys.length, 2 );
});
