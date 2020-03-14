import dux from '.';
import { test_mw } from '../utils/test_mw';
import { phases } from './playPhases';
import { test } from 'tap';

test('action ids', t => {
    const store = dux.createStore();

    store.dispatch({ type: 'noop' });
    const action :any = store.dispatch({ type: 'noop' });

    t.equal(action.meta.action_id, 2);

    t.end();
});
test('timestamps', t => {
    const store = dux.createStore();

    const action :any = store.dispatch({ type: 'noop' });

    t.ok(action.meta.timestamp);

    t.end();
});

test('play_turn', t => {
    const mw = dux.middleware;

    const result = test_mw(mw, {
        action: dux.actions.play_turn(),
    });

    const actions = result.dispatch.getCalls().map(({args}) => args[0].type);

    phases.forEach(phase => t.ok(actions.includes(phase)));

    t.end();
});
