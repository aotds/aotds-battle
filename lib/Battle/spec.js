// @flow

import tap from 'tap';

import Battle from '.';

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
        { id: 'enkidu', coords: [0,0] },
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
