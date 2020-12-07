import { action, payload } from 'ts-action';
import {Bogeys_Shorthand} from './inflate';

type ShipShorthand = any;

type GameInitPayload = {
    game: {
        name: string;
    },
    bogeys: Bogeys_Shorthand,
};

export const init_game = action('init_game', payload<GameInitPayload>());

type AddBogeyPayload = ShipShorthand;

export const add_bogey = action('add_bogey', payload<AddBogeyPayload>());
