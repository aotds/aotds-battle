import { action, payload, empty } from 'ts-action';

export const bogey_movement_res = action(
    'bogey_movement_res',
    payload<{
        bogey_id: string;
        movement: unknown;
    }>(),
);
