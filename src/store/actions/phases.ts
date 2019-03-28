import { action } from "../../actions";
import { Player } from "../game/types";

export const clear_orders = action('CLEAR_ORDERS');

type InitGamePayload = {
  game: {name: string; players: Player[]};
  bogeys?: unknown[];
};

export const init_game = action(
  'INIT_GAME',
  (payload: InitGamePayload) => payload,
);

export const play_turn = action('PLAY_TURN');

/**
 */
export const try_play_turn = action('TRY_PLAY_TURN',
    (force: boolean = false) => ({force}) );
