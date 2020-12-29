import Updux from 'updux';
import u from 'updeep';
import fp from 'lodash/fp';

import inflate from './inflate';

import * as actions from './actions';
import { StructureState } from './types';

const dux = new Updux<StructureState>({
    initial: inflate(),
    actions,
});

dux.addMutation(actions.bogey_damage, ({ damage, penetrating }) => (structure: StructureState) => {
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

export default dux.asDux;
export { inflate };
