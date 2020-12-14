import { WeaponShorthand, WeaponState } from './types';

export default function inflate_weapons(shorthand: WeaponShorthand[] = []): WeaponState[] {
    let id = 1;
    return shorthand.map(s => ({ ...s, id: id++ })) as any;
}
