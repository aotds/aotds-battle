import { Updux } from 'updux';
import _ from 'lodash';
import u from 'updeep';

type ShieldState = {
    id: number;
    level: 1 | 2;
    damaged?: boolean;
};

export const dux = new Updux({
    initial: [] as ShieldState[],
});

type ShieldShorthand = ShieldState | number;

const withIds = u.map((v, idx) => u({ id: idx + 1 }, v));

export const inflate_shields = (shorthand: ShieldShorthand[] = []): ShieldState[] =>
    withIds(
        shorthand.map(sh =>
            _.isPlainObject(sh)
                ? sh
                : {
                      id: 1,
                      level: sh,
                  },
        ),
    );
