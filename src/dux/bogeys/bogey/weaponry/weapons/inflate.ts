import { WeaponShorthand, WeaponsState, WeaponState } from './types';

export function inflate(shorthand: Record<string, WeaponState> | WeaponShorthand[] = []): WeaponsState {
    if (!Array.isArray(shorthand)) return shorthand;

    return Object.fromEntries(shorthand.map((s, i) => [i + 1, { id: i + 1, ...s }]));
}
