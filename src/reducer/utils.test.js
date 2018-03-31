import { pipe_reducers, combine_reducers, init_reducer } from './utils';

test( 'combine_reducers', () => {
    let r1 = (state,action) => ({ a: action.payload });
    let r2 = (state,action) => action.payload +1;

    let bigr = combine_reducers({ r1, r2 });
    const debug = require('debug')('aotds:utils');
    
    expect( bigr({},{ payload: 3 }) ).toMatchObject({
        "r1": {a: 3 },
        "r2": 4,
    });
});

test( 'order of pipe_reducers', () => {
    let r1 = (state,action) => 3 * state;
    let r2 = (state,action) => state * action;

    let bigr = pipe_reducers([ init_reducer(1), r1, r2 ]);
    
    expect( bigr(undefined,7) ).toEqual(21);
});
