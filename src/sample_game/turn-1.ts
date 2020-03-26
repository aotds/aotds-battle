import Battle from '../dux';
import initial_state from './initial_state';

const {
    init_game,
    set_orders,
} = Battle.actions;

export const actions = [
    init_game(initial_state),
    set_orders({
        bogey_id: 'enkidu',
        navigation: { thrust: 1, turn: 1, bank: 1 },
    }),
    // try_play_turn(),
    // set_orders('siduri', {
    //     navigation: { thrust: 1 },
    // }),
    // play_turn(),
];

export const tests = state => t => {

    t.equal( state.game.name, "gemini", 'game name updated' );
}
