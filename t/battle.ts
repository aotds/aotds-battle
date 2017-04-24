import tap = require('tap');
import _ from 'lodash';

import Battle from '../lib/Battle';

interface Logger {
    level?: string;
    debug?: any;
}

import logger from '../lib/Logger';
(<Logger>logger).level = 'debug';

tap.test( 'create battle', tap => {

    let battle = new Battle();

    battle.init_game( {
        name: 'gemini',
        objects: [
            { name: 'Enkidu' },
            { name: 'Siduri' },
        ],
    });

    (<Logger>logger).debug( JSON.stringify( battle.state ) );

    tap.end();
})
