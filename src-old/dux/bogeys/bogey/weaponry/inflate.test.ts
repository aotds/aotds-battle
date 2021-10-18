import { inflate } from '.';

const sample_weaponry = inflate({
    firecons: 2,
    weapons: [{ weapon_type: 'beam', weapon_level: 1, arcs: ['F'] }],
});

test('inflate weapons', () => {
    expect(sample_weaponry).toMatchObject({
        weapons: [{ id: 1, weapon_type: 'beam', weapon_level: 1, arcs: ['F'] }],
    });
});

test('inflate firecons', () => {
    expect(sample_weaponry).toMatchObject({
        firecons: [{ id: 1 }, { id: 2 }],
    });
});
