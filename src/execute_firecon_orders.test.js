import fp from 'lodash/fp';
const debug = require('debug')('aotds:battle:test');

import Battle from './index';
import actions from './actions';
import { get_object_by_id } from './middlewares/selectors';

test( 'basic', () => {
    let state = {
        objects: [
            { id: 'siduri' },
            { 
                id: 'enkidu', 
                weaponry: {
                    firecons: [
                        { id: 1 },
                        { id: 2, weapons: [ 2, 3 ] },
                    ],
                    weapons: [ { id: 1 }, { id: 2 }, { id: 3 }, ],
                },
                orders: {
                    firecons: [
                        { firecon_id: 1, weapons: [ 1, 2 ], target_id: 'siduri' }
                    ]
                }
            }
        ],
    };

    let battle = new Battle(state);

    battle.dispatch(
        actions.execute_firecon_orders()
    );

    expect( battle.state.log.map( l => l.type ) ).toEqual([
        'EXECUTE_FIRECON_ORDERS',
        'EXECUTE_SHIP_FIRECON_ORDERS',
    ]);

    let enkidu = get_object_by_id(battle.state,'enkidu');

    expect( enkidu.weaponry ).toMatchObject({
        firecons: [
            { id: 1, target_id: 'siduri', weapons: [ 1, 2] },
            { id: 2, weapons: [ 3 ] },
        ],
    });


});
