test( 'expand json', () => {

    expect({
        'foo.bar': 1,
        baz: { 'quux.meh': 2 },
    } |> ejson ).toEqual(
        { foo: { bar: 1 }, baz: { quux: { meh: 2 } } }
    );
});
