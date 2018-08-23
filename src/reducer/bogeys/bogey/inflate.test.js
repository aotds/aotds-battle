import inflate from './inflate';

test( 'weapons', () => {

    let ship = {
        weaponry: {
            weapons: [
                { foo: 1 },
            ]
        }
    };

    expect(inflate(ship).weaponry.weapons).toMatchObject({
        1: { foo: 1 }
    })


});
