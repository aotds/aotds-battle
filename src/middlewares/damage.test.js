import { calculate_damage } from './weapons';

import Actions from '../actions';

const debug = require('debug')('aotds:mw:test');

let mock_siduri = { };
jest.mock('./selectors', () => {
    return {
        'get_object_by_id': () => mock_siduri
    };
});

[
    [ 'no shields', [], 4 ],
    [ 'shields level 1', [{ level: 1 }], 3 ],
    [ 'shields level 2', [{ level: 2 }], 2 ],
].forEach( ([ desc, shields, damage ]) => test(desc, () => {
    let store = { getState: jest.fn(), };
    let next = jest.fn();

    mock_siduri.structure = { shields };

    let action = Actions.damage( 'siduri', 'beam', [ 1, 2, 3, 4, 5, 6 ] );

    calculate_damage(store)(next)(action);

    expect(next).toHaveBeenCalledWith(
        { ...action, damage }
    );

}));
