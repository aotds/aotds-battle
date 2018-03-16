import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');

import Battle from './index';

test( 'set orders for enkidu', () => {

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

    expect( _.find( state.objects, { id: 'enkidu' } ) )
        .toMatchObject({ 
            orders: {
                done: true,
                navigation: {
                    thrust: 3,
                    turn:  -1,
                },
            }
    });
})

