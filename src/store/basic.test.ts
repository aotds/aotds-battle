import dux from '.';

test( 'basic play_turn', () => {
    const store = dux.createStore();

    store.dispatch.play_turn();

    console.log( store.getState() );
});
