import reducer from './reducer';

test( 'extras stay', () => {

    expect( reducer( { something: "else" } as any, { type: "noop" }  ) )
        .toHaveProperty( "something", "else" );

});
