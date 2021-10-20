import { Updux } from 'updux';
import { dux, middlewareWrapper, subactionFor } from '.';
import { dux as log } from '../log';

test('incActionId', () => {
	expect(dux.actions.incActionId()).toMatchObject({
		type: 'incActionId',
		meta: {
			noLog: true,
		},
	});
});

test('action ids', () => {
	const snitch = jest.fn();
	const myDux = new Updux({
		subduxes: { dux },
		mutations: {
			'+': (_payload, action) => (state) => {
				snitch(action);
				return state;
			},
		},
		middlewareWrapper,
	});

	const store = myDux.createStore();

	store.dispatch({ type: 'noop' });

	expect(snitch).toHaveBeenCalledWith(
		expect.objectContaining({
			meta: {
				actionId: 1,
			},
		}),
	);

	store.dispatch({ type: 'noop' });

	expect(snitch).toHaveBeenCalledWith(
		expect.objectContaining({
			meta: {
				actionId: 2,
			},
		}),
	);

	expect(store.getState().dux.nextActionId).toEqual(3);
});

test('the stack', () => {
	const myDux = new Updux({
		subduxes: {
			log,
			actionId: dux,
		},
		actions: {
			doThis: () => {},
			doThat: () => {},
			doSomethingElse: () => {},
		},
		middlewareWrapper,
	});

	const subEffect = subactionFor(myDux);

	subEffect('doThis', ({ dispatch }) => () => () => {
		dispatch.doThat();
	});

	const store = myDux.createStore();
	store.dispatch.doThis();
	store.dispatch.doSomethingElse();
});
