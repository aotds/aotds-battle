import { dux, inflate } from '.';

const sample_bogey = inflate({
    orders: {
        firecons: {
            2: { targetId: 'siduri' },
        },
        weapons: { 2: { fireconId: 2 } },
    },
    weaponry: {
        firecons: 2,
        weapons: [
            { weaponType: 'beam', weaponClass: 1 },
            { weaponType: 'beam', weaponClass: 2 },
        ],
    },
});

test('inflate bogey', () => {
    const ship = inflate({
        drive: 8,
        weaponry: {
            firecons: 2,
            shields: [1, 2, 2],
            weapons: [
                { weaponType: 'beam', weaponClass: 1 },
                { weaponType: 'beam', weaponClass: 2 },
            ],
        },
    });

    expect(ship).toMatchObject({
        drive: {
            rating: 8,
            current: 8,
            damageLevel: 0,
        },
        weaponry: {
            weapons: {
                1: { weaponType: 'beam', weaponClass: 1 },
                2: { weaponType: 'beam', weaponClass: 2 },
            },
            firecons: {
                1: { id: 1 },
                2: { id: 2 },
            },
            shields: {
                1: { id: 1, level: 1 },
                2: { id: 2, level: 2 },
                3: { id: 3, level: 2 },
            },
        },
    });
});

test('fireconOrdersPhase', () => {
    const result = dux.reducer(sample_bogey, dux.actions.fireconOrdersPhase());

    expect(result).toHaveProperty('weaponry.firecons.2.targetId', 'siduri');
});

test('weaponOrdersPhase', () => {
    const result = dux.reducer(sample_bogey, dux.actions.weaponOrdersPhase());

    expect(result).toHaveProperty('weaponry.weapons.2.fireconId', 2);
});
