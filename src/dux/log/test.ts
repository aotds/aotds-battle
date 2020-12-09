import dux from '.';
import { hierarchical_log } from '.';

const store = dux.createStore();

store.dispatch({
    type: 'alpha',
    meta: {
        action_id: 1,
    },
});

store.dispatch({
    type: 'beta',
    meta: {
        action_id: 2,
        parent_actions: [1],
    },
});

store.dispatch({
    type: 'gamma',
    meta: {
        action_id: 3,
    },
});

test('log is okay', () => {
    expect(hierarchical_log(store.getState() as any)).toMatchObject([
        { type: 'alpha', subactions: [{ type: 'beta' }] },
        { type: 'gamma' },
    ]);
});
