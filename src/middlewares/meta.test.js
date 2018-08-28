import _ from 'lodash';

import { inc_action_id } from '~/actions';

import { add_action_id, add_parent_action, add_timestamp } from './meta';

test( 'timestamp', () => {

    let result = add_timestamp(null,x => x,{});

    expect(result).toHaveProperty( 'meta.timestamp' );
    expect(result.meta.timestamp).not.toBeUndefined();
    expect(result.meta.timestamp).toMatch(/\d{4}-\d{2}-\d{2}/);

});


test( 'add_action_id', () => {

    let mw = add_action_id();

    let getState = jest.fn();
    getState.mockReturnValue( { log: [ { meta: { id: 3 } } ] } );

    let next = jest.fn()

    mw({ getState },next,{ type: 'STUFF' } );

    expect(getState).toHaveBeenCalledTimes(1);

    expect(next).toHaveBeenCalledWith({ type: 'STUFF', meta: { id: 4 } } );

});

test( 'parent_action_id', () => {

    let mw = add_parent_action();

    let next = jest.fn()

    mw({},next,{ type: 'STUFF' } );

    expect(next).toHaveBeenCalledWith({ type: 'STUFF' } );

    next.mockClear();

    mw({},next,{ type: 'PUSH_ACTION_STACK', parent_id: 3 });

    expect(next).not.toHaveBeenCalled();

    mw({},next,{ type: 'STUFF' });

    expect(next).toHaveBeenCalledWith({ type: 'STUFF', meta: { parent_action_id: 3 } } );

    next.mockClear();

    mw({},next,{ type: 'POP_ACTION_STACK' });

    expect(next).not.toHaveBeenCalled();

    mw({},next,{ type: 'STUFF' });

    expect(next).toHaveBeenCalledWith({ type: 'STUFF' } );

});
