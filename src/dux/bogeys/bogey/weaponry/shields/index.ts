import Updux from 'updux';
import _ from 'lodash';
import u from '@yanick/updeep';

type ShieldState = {
    id: number;
    level: 1 | 2;
    damaged?: boolean;
};

const dux = new Updux({
    initial: [] as ShieldState[],
});

export default dux.asDux;

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
