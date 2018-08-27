import _ from 'lodash';

import { get_bogey, get_object_by_id } from './middlewares/selectors';
import Battle from './index';

const debug = require('debug')('aotds:battle:test');

const mainstate = {
    bogeys: { enkidu: { name: 'Enkidu', id: 'enkidu',
        drive: { rating: 6, current: 6 },
        structure: { hull: { current: 6, max: 7 } },
            weaponry: {
                firecons: { 1: { id: 1 }, 2: { id: 2 },
                },
                weapons: { 1: { id: 1 }, 2: { id: 2 },
                },
            },
    },
        siduri: { name: 'Siduri', id: 'siduri' },
    },
};

test( 'set orders for enkidu', () => {

    const battle = new Battle(mainstate);

    battle.dispatch_action( 'set_orders', 'enkidu', {
        navigation: {
            thrust: 3,
            turn:  -1,
        },
        weaponry: {
            firecons: [{
                firecon_id: 1,
                weapons:    [ 2 ],
                target_id:  'siduri',
            }],
        },
    });

    const enkidu = () => battle.state |> get_bogey('enkidu');

    expect( enkidu().orders )
        .toMatchObject({ 
            navigation: {
                thrust: 3,
                turn:  -1,
            },
            weaponry: {
                firecons: [{
                    firecon_id: 1,
                    weapons:    [ 2 ],
                    target_id:  'siduri',
                }],
            },
    });

    expect(enkidu().orders).toHaveProperty('done');

    // setting it a second time shouldn't work
    battle.dispatch_action( 'set_orders', 'enkidu', {
        navigation: { thrust: 0, turn:  1, }
    });

    expect( enkidu() ).toMatchObject({ orders: { navigation: { thrust: 3, turn: -1 } } });
})
