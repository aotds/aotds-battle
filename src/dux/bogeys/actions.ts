import { action, payload } from 'ts-action';

type ShipShorthand = any;

type GameInitPayload = {
    game: {
        name: string;
    },
    ships: ShipShorthand[],
};

export const init_game = action('init_game', payload<GameInitPayload>());

type AddShipPayload = ShipShorthand;

export const add_ship = action('add_ship', payload<AddShipPayload>());
