import dux from '.';

const store = dux.createStore();

test('init_game', () => {
    store.dispatch(
        store.actions.init_game({
            game: {
                name: 'Gemini',
            },
            bogeys: [{ id: "1" }, { id: "2" }],
        }),
    );

    expect( store.getState() ).toMatchObject(
    {
        game: {
            name: 'Gemini',
            turn: 0,
        },
    });

    expect(store.getState().bogeys).toHaveLength(2);
});
