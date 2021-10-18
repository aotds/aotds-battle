import tap from 'tap';
import dux, { inflateBogey } from '.';

tap.test( 'inflate structure', async t => {
    const bogey = inflateBogey({
        structure: {
            hull: 1,
        }
    });

    t.match(bogey.structure,{
        hull: { current: 1, rating: 1, last_internal_check: 1},
        armor: { rating: 0 },
        destroyed: false,
    }, 'it inflates properly');

});

