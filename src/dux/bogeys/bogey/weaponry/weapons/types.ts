export type Arc = 'F' | 'FP' | 'FS' | 'A' | 'AS' | 'AP';

type BeamWeapon = {
    weaponType: 'beam';
    weaponClass: number;
};

export type Weapon = BeamWeapon;

export type WeaponShorthand = Weapon;

export type WeaponMount = { arcs: Arc[] };

export type WeaponMounted = Weapon & WeaponMount;

export type WeaponState = {
    id: number;
    fireconId?: number;
} & WeaponMounted;

export type WeaponsState = Record<string | number, WeaponState>;
