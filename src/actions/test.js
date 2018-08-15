import actioner, { INIT_GAME, fire_weapon  } from '../actions';

test( 'it loads', () => {
    expect( INIT_GAME ).toBe( 'INIT_GAME' );

    expect( actioner.schema ).toBeDefined();

    expect( actioner.schema['$id'] ).toBe( 'http://aotds.babyl.ca/battle/actions' );

    expect( fire_weapon ).toThrow();

    expect( () => fire_weapon( 'enkidu', 'siduri', 1 ) ).not.toThrow();

});

test( 'meta info', () => {
    expect( actioner.schema ).toHaveProperty(
        'definitions.play_turn.properties.meta'
    );
    expect( actioner.schema ).toHaveProperty(
        'definitions.init_game.properties.meta'
    );

    expect( () => actioner.validate( { type: 'INIT_GAME', meta: {
        id: "potato" } } ) ).toThrow();

    actioner.validate( { type: 'INIT_GAME', meta: {
        id: 1 } });
    expect( () => actioner.validate({ type: 'INIT_GAME', meta: {
        id: 1 } })).not.toThrow();

    
});
