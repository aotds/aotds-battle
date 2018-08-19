import { actions } from '~/actions';

import { movement_phase, bogey_movement } from './index';

const debug = require('debug')('aotds');

import * as selectors from '../selectors';

import * as movement_logic from '~/movement';


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

test( 'bogey_movement', () => {

    let mocked = mock_mw_args();

    selectors.select = jest.fn( 
        () => () => ({ id: 'enkidu' })
    );

    movement_logic.plot_movement = jest.fn( 
        () => 'worked'
    );

    bogey_movement(mocked.store,mocked.next,actions.bogey_movement('enkidu'));

    expect(mocked.store.getState).toHaveBeenCalled();

    expect(mocked.store.dispatch).not.toHaveBeenCalled();
    expect(mocked.next).toHaveBeenCalledWith({
        type: 'BOGEY_MOVEMENT',
        bogey_id: 'enkidu',
        navigation: 'worked',
    });
});
