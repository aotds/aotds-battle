// @flow

import tap from 'tap';

import reducer from './Objects';

import actions from '../Actions';

tap.same(
    reducer( [
        { id: 'enkidu' },
        { id: 'siduri' },
    ], actions.move_object({ 
        object_id: 'enkidu',
        navigation: {
            coords: [5,6],
            velocity: 7,
            heading: 8,
            trajectory: [],
        }
    }) ),
    [{ 
        id: 'enkidu',
        navigation: {
            coords: [5,6],
            velocity: 7,
            heading: 8,
            trajectory: [],
        }
    }, { id: 'siduri' },
    ],
);
