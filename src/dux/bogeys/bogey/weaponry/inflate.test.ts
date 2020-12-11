import {inflate} from '.';

test('inflate', ()=> {
    const inflated = inflate({
        firecons: 2,
    });

    expect(inflated).toMatchObject({
        firecons: [ {id: 1}, {id: 2} ]
    })
});

