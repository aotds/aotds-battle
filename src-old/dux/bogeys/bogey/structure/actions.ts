import { action, payload, empty } from 'ts-action';

export const bogey_damage = action(
    'bogey_damage',
    payload<{
        bogey_id: string;
        damage: number;
        penetrating?: boolean;
    }>(),
);
