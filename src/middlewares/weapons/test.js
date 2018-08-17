import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { actions } from '~/actions';
import { cheatmode, rig_dice } from '~/dice';

import { internal_damage_check } from './index';

const debug = require('debug')('aotds:mw:sagas:weapon:test');

cheatmode();

test( 'no damage? Nothing happen internally', () => {

    let getState = jest.fn();
    let dispatch = jest.fn();
    let next = jest.fn();

    getState.mockReturnValue({
        bogeys: {
            enkidu: { 
                id: 'enkidu',
                structure: { hull: {
                    max: 14,
                    current: 14,
                },
            } }
        }
    });

    internal_damage_check({getState, dispatch})(next)(
        actions.damage('enkidu')
    );

    expect(next).toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
});

const mock_mw_args = () => ( {
    store: { getState: jest.fn(), dispatch: jest.fn() },
    next: jest.fn(),
});

test( 'internal damage? Oh my', () => {

    let mocked = mock_mw_args();

    let ship = { id: 'enkidu', 
        drive: { damage_level: 0 },
        weaponry: {
            weapons: { 1: { id: 1 }, 2: { id: 2, damaged: false }, 3: { id: 3, damaged: true } },
            firecons:{ 
                1: { id: 1, damaged: true },
                2: { id: 2 }, 
            },
        },
        structure: { 
            hull: { current: 14, max: 14 },
            shields: { 1: { id: 1 }, 2: { id: 2 } },
        } 
    };

    rig_dice([1,2,90,3,3,90]);

    let selectors = require('../selectors');
    selectors.get_bogey = jest.fn()
    selectors.get_bogey.mockReturnValueOnce( () => ship );
    selectors.get_bogey.mockReturnValueOnce( () => u.updateIn(
        'structure.hull.current', 12
    )(ship) );

    mocked.store.getState.mockReturnValueOnce({});

    internal_damage_check( mocked.store, mocked.next, actions.damage( 'enkidu' ) );

    expect(mocked.store.getState).toHaveBeenCalled();

    expect(mocked.store.dispatch.mock.calls |> fp.flatten ).toMatchObject([
        { type:  'drive' },  
        { type:  'firecon',  id: 2 },    
        { type:  'weapon',   id: 2 },    
        { type:  'shield',   id: 1 },    
    ].map( system => ({ type: 'INTERNAL_DAMAGE', system })));

});
