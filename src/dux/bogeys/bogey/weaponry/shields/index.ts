import { Updux } from 'updux';
import { isPlainObject } from 'lodash';
import u from 'updeep';

type ShieldLevel = 1 | 2;

type ShieldState = {
    id: number;
    level: ShieldLevel;
    damaged?: boolean;
};

type ShieldsState = Record<string | number, ShieldState>;

export const dux = new Updux({
    initial: [] as ShieldState[],
});

type ShieldShorthand = ShieldState | number;

const withIds = u.map((v, idx) => u({ id: idx + 1 }, v));

export const inflate = (shorthand: Record<number, ShieldState> | ShieldLevel[] = []): ShieldsState => {
    if (!Array.isArray(shorthand)) return shorthand;

    return Object.fromEntries(shorthand.map((level, id) => [id + 1, { level, id: id + 1 }]));
};
