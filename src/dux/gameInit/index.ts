import Updux from 'updux';
import { action, empty, payload } from 'ts-action';
import u from 'updeep';

type GameInitPayload = {};

const init_game = action('init_game', payload<GameInitPayload>() );

const dux = new Updux({
    actions: {
        init_game
    },
    mutations: [
        [ init_game, payload => u(payload) ]
    ]
});
export default dux;

