import { action, payload } from 'ts-action';

export const try_play_turn = action(
	'try_play_turn',
	payload<{ force: boolean }>(),
);
