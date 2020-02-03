import battle from '.';

test( 'extras stay', () => {

    expect( battle.reducer( { something: "else" } as any, { type: "noop" }  ) )
        .toHaveProperty( "something", "else" );

});
