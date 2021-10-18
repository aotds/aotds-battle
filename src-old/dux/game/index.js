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
        playRound: null,
    },
    mutations: {
        playRound: () => u({ round: fp.add(1) })
    }
});
