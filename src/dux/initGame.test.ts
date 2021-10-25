import { dux } from '.';

const store = dux.createStore();

test('init_game', () => {
	store.dispatch(
		store.actions.initGame({
			game: { name: 'Gemini' },
			bogeys: [{ name: '1' }, { name: '2' }],
		}),
	);

	expect(store.getState()).toMatchObject({
		game: {
			name: 'Gemini',
			turn: 0,
		},
	});

	expect(store.getState.bogeysList()).toHaveLength(2);

	expect(store.getState()).toHaveProperty('bogeys.1.id', '1');

	expect(store.getState()).toHaveProperty('bogeys.1.navigation.velocity', 0);
});
