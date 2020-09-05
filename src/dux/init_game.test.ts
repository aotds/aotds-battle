import dux from '.';
import {mock_mw} from '../utils/mock-mw';

const store = dux.createStore();

test('init_game', () => {
    store.dispatch(
        store.actions.init_game({
            game: {
                name: 'Gemini',
            },
            ships: [{ id: 1 }, { id: 2 }],
        }),
    );

    expect(store.getState()).toMatchObject({
        game: {
            name: 'Gemini',
            turn: 0,
        },
    });

    expect(store.getState().ships).toHaveLength(2);
});
