export type Arc = 'F' | 'FP' | 'FS' | 'A' | 'AS' | 'AP';

type BeamWeapon = {
    weapon_type: 'beam';
    weapon_class: number;
};

export type Weapon = BeamWeapon;

export type WeaponShorthand = Weapon;

export type WeaponMount = { arcs: Arc[] };

export type WeaponMounted = Weapon & WeaponMount;

export type WeaponState = {
    id: number;
    firecon_id?: number | null;
} & WeaponMounted;
