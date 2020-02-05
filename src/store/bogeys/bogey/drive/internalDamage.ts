import u from 'updeep';
import { action, payload } from 'ts-action';

type InternalDamageSystem =
     {
          system: 'drive';
      }
    | { system: 'firecon' | 'weapon' | 'shield'; system_id: number };

type D100 = number;

type InternalDamageBase = {
    bogey_id: string;
    threshold?: number;
    dice?: [D100];
    hit?: boolean;
};

type InternalDamage = InternalDamageBase & InternalDamageSystem;

export const internal_damage = action('internal_damage', payload<InternalDamage>() );
