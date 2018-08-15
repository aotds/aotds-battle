import inflate from './inflate';

const debug = require('debug')('aotds');

test( 'inflate', () => {

    let inflated = inflate({
        game: {
        },
        bogeys: [
            { 
                id: 'enkidu',
                drive: 3,
                structure: { shields: [ 1, 1, 2 ] },
                weaponry: { firecons: 2 },
            }
        ]
    });

    expect(inflated).toMatchSnapshot();

});
