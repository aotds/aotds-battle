import tap from 'tap';

import inflate from './inflate';

tap.match(
    inflate({
        bogeys: [{ weaponry: { firecons: 2 } }],
    }).bogeys as any,
    [
        {
            weaponry: {
                firecons: [{ id: 1 }, { id: 2 }],
            },
        },
    ],
);
