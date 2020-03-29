import { inflateBattle } from '.';
import tap from 'tap';

tap.match(
    inflateBattle({
        bogeys: [{ weaponry: { firecons: 2 } }],
    }).bogeys,
    [
        {
            weaponry: {
                firecons: [{ id: 1 }, { id: 2 }],
            },
        },
    ],
);
