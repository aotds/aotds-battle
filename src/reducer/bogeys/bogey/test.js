import u from 'updeep';
import fp from 'lodash/fp';

import Actions from '../../../actions';

import reducer from './index';

test( 'thrust_used', () => {

    let ship = { drive: { }, navigation: { } };

    let state = reducer( ship, { type: 'MOVE_OBJECT', navigation: {
        thrust_used: 2
    }} );

    expect(state).toMatchObject({
        drive: { thrust_used: 2 }
    });

    state = reducer( state, { type: 'PLAY_TURN' } );

    expect(state.drive).not.toHaveProperty('thrust_used');

});

test( 'internal damage', () => {
    let ship = {
        drive: { rating: 9, },
        weaponry: { 
            firecons: [ { id: 1 } ],
            weapons:  [ { id: 1 } ],
        },
    };

    ship = reducer(ship, Actions.internal_damage(
        'enkidu', { type: 'drive' }
    ));

    expect(ship).toMatchObject({
        drive: { damage_level: 1, current: 4 },
    });

    ship = reducer(ship, Actions.internal_damage(
        'enkidu', { type: 'drive' }
    ));

    expect(ship).toMatchObject({
        drive: { damage_level: 2, current: 0 },
    });

});
