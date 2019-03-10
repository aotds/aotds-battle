import { action } from '../../../actions';
import { D100 } from '../../types/misc';

type InternalDamageSystem =
  | {
      type: 'drive';
    }
  | {type: 'firecon' | 'weapon' | 'shield'; id: number};

type InternalDamage = {
  bogey_id: string;
  system: InternalDamageSystem;
  threshold?: number;
  dice?: [D100];
  hit?: boolean;
};

export const internal_damage = action(
  'INTERNAL_DAMAGE',
    (
      bogey_id: string,
      system:
        | InternalDamageSystem
        | 'drive'
        | ['firecon' | 'weapon' | 'shield', number],
      thresholdOrHit: number | boolean,
    ) => {
      if (typeof system === 'string') {
        system = {type: system} as InternalDamageSystem;
      } else if (Array.isArray(system)) {
        system = {
          type: system[0],
          id: system[1],
        };
      }

      let payload: InternalDamage = {bogey_id, system};

      if (typeof thresholdOrHit === 'boolean') {
        payload.hit = thresholdOrHit;
      } else {
        payload.threshold = thresholdOrHit;
      }

      return payload;
    },
);
