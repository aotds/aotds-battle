import game_reducer from './reducer';
import { init_game } from '../actions/phases';

test( 'init_game', () => {
    let state = game_reducer(undefined, init_game( { game: { name: 'bob', players: [] } } ) );
    expect(state).toMatchObject({
        name: 'bob',
        players: [],
        turn: 0,
    });
})
