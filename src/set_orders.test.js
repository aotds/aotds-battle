import tap from 'tap';
import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');

import Battle from './index';

tap.test( 'set orders for enkidu', tap => {

    const battle = new Battle();

    battle.init_game( {
        game: {
            name: 'gemini',
        },
        objects: [
            { name: 'Enkidu', id: 'enkidu' },
            { name: 'Siduri', id: 'siduri' },
        ],
    });

    battle.set_orders( 'enkidu', {
        navigation: {
            thrust: 3,
            turn:  -1,
        },
    });

    let state = battle.state;

    debug( "%O", state);

    tap.match( _.find( state.objects, { id: 'enkidu' } ), { 
        orders: {
            done: true,
            navigation: {
                thrust: 3,
                turn:  -1,
            },
        }
    }, 'enkidu' );

    tap.end();
})

