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
