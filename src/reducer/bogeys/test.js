import bogeys from './index';

test('init_game', () => {

    let state = bogeys(undefined, init_game({ bogeys: { id: 'enkidu' } }));

    expect(state).toHaveProperty('enkidu');
});
