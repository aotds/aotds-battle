import tap from 'tap';
import _ from 'lodash';
const debug = require('debug')('aotds:battle:test');

import Battle from './index';

tap.test( 'create battle', tap => {

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

    let state = battle.state;

    tap.match( state, { 
        game: { name: 'gemini', turn: 0 },
        objects: [
            { name: 'Enkidu' },
            { name: 'Siduri' },
        ],
    }, 'game' );

    tap.end();
})

