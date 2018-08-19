import { actions } from '~/actions';

import { movement_phase } from './index';

const debug = require('debug')('aotds');

import * as selectors from '../selectors';

const mock_mw_args = () => ( {
    store: { getState: jest.fn(), dispatch: jest.fn() },
    next: jest.fn(),
});

test('movement_phase on other actions', () => {
    let mocked = mock_mw_args();

    movement_phase(mocked.store,mocked.next,{ type: 'OTHER' });

    expect(mocked.store.getState).not.toHaveBeenCalled();
});

test( 'movement_phase', () => {

    let mocked = mock_mw_args();

    selectors.select = jest.fn( 
        () => () => [ 
            { id: 'enkidu', navigation: true },
            { id: 'siduri', navigation: true },
            { id: 'gilgamesh' },
        ]
    );

    movement_phase(mocked.store,mocked.next,actions.movement_phase());

    expect(mocked.store.getState).toHaveBeenCalled();

    expect(mocked.store.dispatch).toHaveBeenCalledTimes(2);
    expect(mocked.store.dispatch).nthCalledWith(1, actions.bogey_movement('enkidu'));
    expect(mocked.store.dispatch).nthCalledWith(2, actions.bogey_movement('siduri'));

});
