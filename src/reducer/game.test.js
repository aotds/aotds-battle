import reducer from './game';

import Actions from '../actions';

const debug = require('debug')('aotds');

test( 'times', () => {

    let timestamp = '2018-04-03T22:52:33.845Z';

    let state = reducer({ 
        turn_times: {
            max: "24h",
        },
    },{
        type: 'PLAY_TURN',
        timestamp,
    });

    expect(state).toMatchObject({
        turn_times: {
            max: "24h",
            started: timestamp,
            deadline: '2018-04-04T22:52:33.845Z',
        },
    });

});

test( 'next_action_id', () => {
    let state = reducer(undefined,{});

    expect(state).toHaveProperty('next_action_id',1);

    state = reducer(state,Actions.actions.inc_action_id());

    expect(state).toHaveProperty('next_action_id',2);
});
