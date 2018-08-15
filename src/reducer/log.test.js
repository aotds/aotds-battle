import reducer, { tree_log } from './log';


test( 'logs', () => {

    let state = reducer( undefined, { type: 'STUFF', meta: { id: 123 } } );

    state = reducer(state,{ type: 'FOO', meta: { id: 124, parent_action_id: 123 } } );

    state = reducer(state,{ type: 'BAR', meta: { id: 125 } } );

    expect(state).toMatchSnapshot('state');
    expect(state |> tree_log ).toMatchSnapshot('tree');
});
