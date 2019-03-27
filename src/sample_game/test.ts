// @format

import Battle from '../battle/index';

let turns = [
    new Battle({
        devtools: {
            // suppressConnectErrors: false,
            // wsEngine: 'uws',
        },
    }),
];

test('turn[0]', () => {
    expect(turns[0]).toBeTruthy();
});
