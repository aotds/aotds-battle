export type FireconsState = Record<number, FireconState>;

export type FireconState = {
    id: number;
    targetId?: string;
    damaged?: boolean;
};

export type FireconsShorthand = FireconsState | number;
