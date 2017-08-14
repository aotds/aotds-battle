// @flow

import tap from 'tap';

import log_reducer from './Log';

const action_foo  = { type: 'FOO', payload: { something: true } };

tap.same(
    log_reducer( undefined, action_foo ),
    [ action_foo ],
);

tap.same(
    log_reducer( undefined, { type: '@@redux/INIT' } ),
    [ ],
    'skip @@redux/INIT'
);
