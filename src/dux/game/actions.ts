import { action, payload } from 'ts-action';

type GameInitPayload = {
    game: {
        name: string;
    },
    bogeys: unknown[],
};

export const init_game = action('init_game', payload<GameInitPayload>());
