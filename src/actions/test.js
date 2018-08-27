import actioner, { INIT_GAME, bogey_fire_weapon  } from '../actions';

describe('it loads', () => {
    test( 'INIT_GAME', () => {
        expect( INIT_GAME ).toBe( 'INIT_GAME' );
    });

    test('schema', () => {
        expect( actioner.schema ).toBeDefined();

        expect( actioner.schema['$id'] ).toBe( 'http://aotds.babyl.ca/battle/actions' );
        
    });

    test('action with restrictions', () => {

        expect( bogey_fire_weapon ).toThrow();

        expect( () => bogey_fire_weapon( 'enkidu', 'siduri', 1 ) ).not.toThrow();

        
    });

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
