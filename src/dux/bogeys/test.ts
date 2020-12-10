import dux from '.';
import { mock_mw } from '../../utils/mock-mw';

const debug = require('debug')('aotds');

test('generates bogey_movement', () => {
    const res = mock_mw(dux.middleware, {
        action: dux.actions.movement_phase(),
        api: {
            getState() {
                return [{ id: 'a' }, { id: 'b' }];
            },
        },
    });

    expect(res.api.dispatch).toHaveBeenCalledTimes(2);

    expect(res.api.dispatch).toHaveBeenCalledWith(expect.objectContaining(dux.actions.bogey_movement('a')));
});

test('movement', () => {
    const res = mock_mw(dux.middleware, {
        action: dux.actions.bogey_movement('enkidu'),
        api: {
            getState() {
                return [
                    {
                        id: 'enkidu',
                        navigation: {
                            velocity: 0,
                        },
                    },
                ];
            },
        },
    });

    expect(res.api.dispatch).toHaveBeenCalled();
});
