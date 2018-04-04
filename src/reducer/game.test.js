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
