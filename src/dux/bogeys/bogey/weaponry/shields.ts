import Updux, { DuxState } from 'updux';
import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import { action } from 'ts-action';

type ShieldState = {
    id: number;
    level: 1 | 2;
    damaged?: boolean;
};

const dux = new Updux({
    initial: [] as ShieldState[],
});

export default dux.asDux;

type ShieldShorthand = ShieldState | 1 | 2;

export function inflateShields(shorthand: ShieldShorthand[] = []): ShieldState[] {
    let id = 0;

    return shorthand.map(shield => {
        id++;
        if (typeof shield === 'object') return shield;
        return { id, level: shield };
    });
}
