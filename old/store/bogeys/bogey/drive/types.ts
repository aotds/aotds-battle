export type DriveState = {
	rating: number;
	current: number;
	damage_level?: 1 | 2;
};

export type DriveStateShorthand = DriveState | number;
