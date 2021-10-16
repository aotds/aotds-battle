import { Updux } from 'updux';
import u from 'updeep';
import fp from 'lodash/fp';

import inflate from './inflate';

import * as actions from './actions';

export { inflate };

export const dux = new Updux({
    initial: inflate(),
    actions,
});

dux.setMutation('bogey_damage', ({ damage, penetrating }) => (structure) => {
    if (!damage) return structure;

    let armor = structure.armor.current;

    const dec_current = (damage: number) => (v: number) => v - damage;

    if (!penetrating) {
        const armor_damage = Math.min(fp.ceil(damage / 2), armor);
        damage -= armor_damage;

        structure = u.updateIn('armor.current', dec_current(armor_damage), structure) as any;
    }

    structure = u.updateIn('hull.current', dec_current(damage), structure) as any;

    return structure;
});

