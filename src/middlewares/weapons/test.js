import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import { actions, bogey_fire_weapon } from '~/actions';
import { cheatmode, rig_dice } from '~/dice';

import { firecon_orders_phase, bogey_firing_actions } from './';
import { internal_damage_check } from './index';
import * as selectors from '../selectors';

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

test('firecon_orders_phase', () => {

    let mocked = mock_mw_args();

    selectors.select = jest.fn( function(a,b) {
        return [
            { id: 'enkidu', orders: { firecons: { 1: { firecon_id: 1, target_id: 'siduri' } } } },
            { id: 'siduri', orders: { firecons: { 2: { firecon_id: 2, target_id: 'enkidu' } } } },
            { id: 'gilgamesh' },
        ];
    } |> _.curry );


    firecon_orders_phase( mocked.store )( mocked.next )( actions.firecon_orders_phase() );

    expect(mocked.store.getState).toHaveBeenCalled();

    expect(selectors.select).toHaveBeenCalled();

    expect(mocked.store.dispatch).toHaveBeenCalledTimes(2);

    expect( mocked.store.dispatch.mock.calls |> _.flatten ).toMatchObject(
        [
            actions.execute_firecon_orders( 'enkidu', 1, { target_id: 'siduri' } ),
            actions.execute_firecon_orders( 'siduri', 2, { target_id: 'enkidu' } ),
        ]
    );
    
});

test('bogey_firing_actions', () => {

    let ship = {
        id: 'enkidu',
        weaponry: {
            firecons: {
                1: { id: 1, target_id: 'siduri' }
            },
            weapons: {
                1: { id: 1, firecon_id: 1 },
                2: { id: 2, firecon_id: 1 },
                3: { id: 3 },
            },
        },
    }
    
    let actions = bogey_firing_actions(ship);

    expect(actions).toMatchObject([
        bogey_fire_weapon('enkidu','siduri',1),
        bogey_fire_weapon('enkidu','siduri',2)
    ]);

});
