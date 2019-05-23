import { action } from "../../actions";
import { Player } from "../game/types";

export const clear_orders = action('CLEAR_ORDERS');
export const movement_phase = action('MOVEMENT_PHASE');
export const firecons_order_phase = action('FIRECONS_ORDER_PHASE');
export const weapons_order_phase = action('WEAPONS_ORDER_PHASE');
export const weapons_firing_phase = action('WEAPONS_FIRING_PHASE');

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

export const fire_weapon = action('FIRE_WEAPON',
                                  (bogey_id,target_id,weapon_id) => ({bogey_id,target_id,weapon_id}) );


/**
    play_turn
        weapons_firing_phase
            weapon_fire
                weapon_fire
                    weapon_fire_outcome
*/
