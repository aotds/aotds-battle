import tap from 'tap';
import dux from '.';

const structure_reducer = dux.reducer;

const tests = [
    { action: { damage: 1, is_penetrating: false }, hull: 10, armor: 1 },
    { action: { damage: 2, is_penetrating: false }, hull: 9, armor: 1 },
    { action: { damage: 6, is_penetrating: false }, hull: 6, armor: 0 },
    { action: { damage: 6, is_penetrating: true }, hull: 4, armor: 2 },
];

tap.test('different damage values', async t => {
    tests.forEach(({ action, hull, armor }) =>
        t.match(
            structure_reducer(
                { hull: { current: 10 }, armor: { current: 2 } } as any,
                dux.actions.bogey_damage(action as any),
            ),
            {
                hull: { current: hull },
                armor: { current: armor },
            },
            JSON.stringify(action),
        ),
    );
});

tap.ok(
    (structure_reducer(
        { hull: { current: 10 }, armor: { current: 2 } } as any,
        dux.actions.bogey_damage({
            damage: 12,
        } as any),
    ) as any).destroyed,
    'destroy',
);
