export type Shield = {
  id: number;
  level: 1 | 2;
  damaged?: boolean;
};

export type StructureState = {
  hull: {
    current: number;
    rating: number;
  };
  shields?: Shield[];
  armor?: { current: number; rating: number };
  destroyed?: boolean;
};

export type ShieldStateShorthand = Shield | number;

export type StructureStateShorthand = {
  hull: {
    current: number;
    rating: number;
  } | number;
  shields?: Shield[] | number[];
  armor?: { current: number; rating: number } | number;
  destroyed?: boolean;
};
