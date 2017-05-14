import tap = require('tap');
import _ from 'lodash';

import Battle from '../lib/battle';

interface Logger {
    level?: string;
    debug?: any;
}

import logger from '../lib/Logger';
(<Logger>logger).level = 'debug';

tap.test( 'create battle', tap => {

    const battle = new Battle();

    battle.init_game( {
        name: 'gemini',
        objects: [
            { name: 'Enkidu' },
            { name: 'Siduri' },
        ],
    });

    let state = battle.state;

    tap.same( state.game, { name: 'gemini' }, 'game' );
    tap.same( state.objects, [ 
        { name: 'Enkidu' }, 
        { name: 'Siduri' } 
    ], 'objects' );

    tap.end();
})

import Schema from '../lib/battle/Schema';

console.log( JSON.stringify( Schema ) )
