import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');

import Battle from './index';

import { get_object_by_id } from './middlewares/selectors';

const mainstate = {
    objects: [
        { name: 'Enkidu', id: 'enkidu',
            weaponry: {
                firecons: [
                    { id: 1 }, { id: 2 },
                ],
                weapons: [
                    { id: 1 }, { id: 2 },
                ],
            },
        },
        { name: 'Siduri', id: 'siduri' },
    ],
};

test( 'set orders for enkidu', () => {

    const battle = new Battle(mainstate);

    battle.set_orders( 'enkidu', {
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

    let ship_orders = get_object_by_id(battle.state, 'enkidu').orders;

    expect( ship_orders )
        .toMatchObject({ 
            done: true,
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
})

