// @format

import { subactions_mw } from './subactions';
import { test_mw } from '../middleware/test_fixtures';

test('basic', () => {
    const parent = { type: 'noop', meta: { action_id: 12, parent_actions: [1, 2] } };

    let mw = subactions_mw(parent as any, ({ dispatch }) => () => action => {
        dispatch({ type: 'FOO', bar: action.type });
        dispatch({ type: 'THIS' });
    });

    const { next, dispatch } = test_mw(mw, { action: parent });

    expect(next).toHaveBeenCalledWith(parent);

    expect(dispatch).toHaveBeenCalledWith({
        type: 'FOO',
        meta: { parent_actions: [1, 2, 12] },
        bar: 'noop',
    });

    expect(dispatch).toHaveBeenCalledWith({
        type: 'THIS',
        meta: { parent_actions: [1, 2, 12] },
    });
});
