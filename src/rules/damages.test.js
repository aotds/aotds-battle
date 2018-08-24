import { calculate_damage } from './damages';

const debug = require('debug')('aotds:rules:damage:test');

const scenarios = [
    [ 'no shield', [], 4 ],
    [ 'level 1', [1], 3],
    [ 'level 2', [2], 2 ],
    [ 'level 1 and 2', [1,2], 2 ],
];

function test_me([ desc, shields, damage ]) {

    test(desc, () => {
        let bogey = { structure: { shields: shields.map( level => ({  level }) ) } };
        const dice = [ 1, 2, 3, 4, 5, 6 ];

        expect( calculate_damage({ bogey, dice }) ).toEqual( damage );
    });
}

scenarios.forEach( test_me );
