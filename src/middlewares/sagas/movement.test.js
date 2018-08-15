import { movement_phase } from './movement';

const debug = require('debug')('aotds');

test( 'movement_phase', () => {
    let saga = movement_phase({ type: 'STUFF' });

    saga.next();

    let result = saga.next([ 
        {id: 'enkidu', navigation: true },
        {id: 'siduri', navigation: true },
        {id: 'dummy' } 
    ]);

    expect( result.value ).toMatchObject({
        PUT: { action: { object_id: 'enkidu' } }
    })

    expect( saga.next().value ).toMatchObject({
        PUT: { action: { object_id: 'siduri' } }
    })

    expect(saga.next().done).toBeTruthy();

});

test( 'movement_phase with parent_id', () => {
    let saga = movement_phase({ type: 'STUFF', meta: { id: 123 } });

    saga.next();

    let result = saga.next([ 
        {id: 'enkidu', navigation: true },
        {id: 'siduri', navigation: true },
        {id: 'dummy' } 
    ]);

    expect( result.value ).toMatchObject({
        PUT: { action: { type: 'PUSH_ACTION_STACK' } }
    })

    expect( saga.next().value ).toMatchObject({
        PUT: { action: { object_id: 'enkidu' } }
    })

    expect( saga.next().value ).toMatchObject({
        PUT: { action: { object_id: 'siduri' } }
    })

    expect( saga.next().value ).toMatchObject({
        PUT: { action: { type: 'POP_ACTION_STACK' } }
    })

    expect(saga.next().done).toBeTruthy();

});
