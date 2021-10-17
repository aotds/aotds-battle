export type ShieldState = {
	id: number;
	level: 1 | 2;
	damaged?: boolean;
};

export type StructureState = {
	hull: {
		current: number;
		rating: number;
	};
	shields?: ShieldState[];
	armor?: { current: number; rating: number };
	destroyed?: boolean;
};

export type ShieldStateShorthand = ShieldState | number;

export type StructureStateShorthand = {
	hull:
		| {
				current: number;
				rating: number;
		  }
		| number;
	shields?: ShieldState[] | number[];
	armor?: { current: number; rating: number } | number;
	destroyed?: boolean;
};
