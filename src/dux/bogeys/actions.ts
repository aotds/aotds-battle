import { action, payload, empty } from 'ts-action';

export const add_bogey = action('add_bogey', payload<unknown>());

export const try_play_turn = action('try_play_turn', empty());
export const play_turn = action('play_turn', empty());
