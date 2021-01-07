import Updux from 'updux';
import u from '@yanick/updeep';

import bogeys from '.';

const test_dux = new Updux({
    initial: {
        actions: [],
    },
    subduxes: {
        bogeys,
    },
    mutations: {
        '*': (_payload, action) =>
            u.updateIn('actions', state => {
                return state ? [...state, action.type] : [action.type];
            }),
    },
});

test('happy path', () => {
    const store = test_dux.createStore({
        bogeys: [
            { player_id: 'yanick', orders: { done: true } },
            { player_id: 'yenzie', orders: { done: true } },
        ],
    });

    store.dispatch(store.actions.try_play_turn());

    expect(store.getState().actions).toContain('play_turn');
});

test('orders not done', () => {
    const store = test_dux.createStore({
        bogeys: [{ player_id: 'yanick' }, { player_id: 'yenzie', orders: { done: true } }],
    });

    store.dispatch(store.actions.try_play_turn());

    expect(store.getState().actions).not.toContain('play_turn');
});

test('only one player', () => {
    const store = test_dux.createStore({
        bogeys: [{ orders: { done: true } }, { player_id: 'yenzie', orders: { done: true } }],
    });

    store.dispatch(store.actions.try_play_turn());

    expect(store.getState().actions).not.toContain('play_turn');
});
