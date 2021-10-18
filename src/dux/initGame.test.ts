import { dux } from '.';

const store = dux.createStore();

test('init_game', () => {
	store.dispatch(
		store.actions.initGame('Gemini', [{ name: '1' }, { name: '2' }]),
	);

	expect(store.getState()).toMatchObject({
		game: {
			name: 'Gemini',
			round: 0,
		},
	});

	expect(store.getState.bogeysList()).toHaveLength(2);

	expect(store.getState()).toHaveProperty('bogeys.1.id', '1');
});
