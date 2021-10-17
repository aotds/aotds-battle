import { inflate } from './inflate';

test('inflate firecons', () => {
    const inflated = inflate(2);
    expect(inflated).toMatchObject({
        1: { id: 1 },
        2: { id: 2 },
    });
    expect(inflate(inflated)).toMatchObject(inflated);
});
