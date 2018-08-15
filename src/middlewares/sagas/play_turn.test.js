import { play_turn } from './play_turn';

test('play_turn, forced', () => {
    let saga = play_turn({ force: true });    

    let actions = [ ...saga ];

    expect([...actions]).toMatchObject(
    [  
        'MOVEMENT_PHASE',
        'EXECUTE_FIRECON_ORDERS',
        'ASSIGN_WEAPONS_TO_FIRECONS',
        'EXECUTE_FIRECON_ORDERS',
        'FIRE_WEAPONS',
        'CLEAR_ORDERS',
    ].map( a => ({ PUT: { action: { type: a }}}) ));
});
