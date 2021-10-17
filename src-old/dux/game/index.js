import { Updux } from 'updux';
import u from 'updeep';
import fp from 'lodash/fp.js';

// type GameInitPayload = {
//     game: {
//         name: string;
//     },
//     bogeys: unknown[],
// };

export default new Updux({
    actions: {
        initGame: (name,bogeys) => ({game: { name }, bogeys }),
        playRound: null,
    },
    initial: { name: '', round: 0 },
    mutations: {
        initGame: ({game: { name }}) => u({name}),
        playRound: () => u({ round: fp.add(1) })
    }
});
