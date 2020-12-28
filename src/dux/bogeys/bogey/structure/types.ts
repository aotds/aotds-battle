export type HullState = {
    current: number;
    rating: number;
};

export type ArmorState = {
    rating: number;
    current: number;
};

export type StructureState = {
    hull: HullState;
    armor: ArmorState;
};
