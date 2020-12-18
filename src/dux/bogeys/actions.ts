import { action, payload, empty } from 'ts-action';

export const add_bogey = action('add_bogey', payload<unknown>());

export const try_play_turn = action('try_play_turn', empty());
export const play_turn = action('play_turn', empty());
export const movement_phase = action('movement_phase', empty());
export const bogey_movement = action('bogey_movement', payload<string>());
export const weapon_firing_phase = action('weapon_firing_phase', empty());

export const bogey_fire = action('bogey_fire', payload<string>());
export const firecon_fire = action(
    'firecon_fire',
    payload<{
        bogey_id: string;
        firecon_id: number;
    }>(),
);

export const weapon_fire = action(
    'weapon_fire',
    payload<{
        bogey_id: string;
        weapon_id: number;
        target_id: string;
    }>(),
);

export const weapon_fire_outcome = action(
    'weapon_fire_outcome',
    payload<{
        bogey_id: string;
        outcome: FireWeaponOutcome;
    }>(),
);

export const bogey_damage = action(
    'bogey_damage',
    payload<{
        bogey_id: string;
        damage: number;
        penetrating?: boolean;
    }>(),
);
