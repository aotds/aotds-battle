import fp from 'lodash/fp';

import { actions } from '~/actions';

import play_turn from './play_turn';

test('play_turn, forced', () => {

    let getState = jest.fn();
    let dispatch = jest.fn();
    let next     = jest.fn();

    play_turn({getState,dispatch})(next)(actions.play_turn(true));

    expect(getState).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledWith(actions.play_turn(true));

    expect(
        dispatch.mock.calls |> fp.map('0') |> fp.map('type')
    ).toMatchObject([  
        'MOVEMENT_PHASE',
        'EXECUTE_FIRECON_ORDERS',
        'ASSIGN_WEAPONS_TO_FIRECONS',
        'EXECUTE_FIRECON_ORDERS',
        'FIRE_WEAPONS',
        'CLEAR_ORDERS',
    ]);
});
