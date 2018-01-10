import { test } from 'babel-tap';

import { move_ranges } from './index';

test( 'do it', t => {
    t.pass( 'so far, so good' );

    t.match( move_ranges(), {  thrust: [0,1] } );

    t.end();
})
