import dux from '.';

const structure_reducer = dux.reducer;

const tests = [
    { action: { damage: 1, penetrating: false }, hull: 10, armor: 1 },
    { action: { damage: 2, penetrating: false }, hull: 9, armor: 1 },
    { action: { damage: 6, penetrating: false }, hull: 6, armor: 0 },
    { action: { damage: 6, penetrating: true }, hull: 4, armor: 2 },
];

test.each(tests)('%j', ({ action, hull, armor }) => {
    expect(
        structure_reducer(
            { hull: { current: 10 }, armor: { current: 2 } } as any,
            dux.actions.bogey_damage(action as any),
        ),
    ).toMatchObject({
        hull: { current: hull },
        armor: { current: armor },
    });
});
