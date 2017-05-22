import tap from 'tap';
import _ from 'lodash';

import Battle from '../lib/battle';

import logger from '../lib/Logger';
logger.level = 'debug';

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

