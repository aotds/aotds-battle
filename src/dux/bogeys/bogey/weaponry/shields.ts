import Updux  from 'updux';
import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import { internal_damage } from '../rules/checkInternalDamage';

type ShieldState = {
    id: number;
    level: 1 | 2;
    damaged?: boolean;
};

const dux = new Updux({
    initial: [] as ShieldState[],
    actions: { internal_damage },
});

dux.addMutation(dux.actions.internal_damage, ({ system, system_id }) =>
    u.if(system === 'shield', u.map(u.if(fp.matches({ id: system_id }), { damaged: true }))),
);

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
