// @flow

import tap from 'tap';

import Battle from '.';

import logger from '../Logger';

logger.level = 'trace';

let battle = new Battle();

tap.same( 
    battle.state,
    { log: [], game: { turn: 0 }, objects: [ ] },
    'initial state'
);

tap.pass('so far, so good');

battle.init({
    name: 'Epsilon 7',
    objects: [
        { id: 'enkidu', coords: [0,0], velocity: 3, heading: 0 },
        { id: 'siduri', coords: [1,1], velocity: 3, heading: 0 },
    ],
});

tap.includes( 
    battle.state,
    {   
        game: { turn: 0, name: 'Epsilon 7' },
        objects: [ { id: 'enkidu', coords: [0,0] } ],
    },
    'initial state'
);

battle.dispatch_action('PLAY_MOVE_OBJECT', { object_id: 'enkidu' });

tap.includes( 
    battle.state,
    {   
        objects: [ { id: 'enkidu', coords: [3,0] } ],
    },
    'ship moved'
);
