import fp from 'lodash/fp';
import _ from 'lodash';
import { BogeyState } from '../..';

const beamDamage = (shield = 0) => (dice: number) => {
    const table = {
        4: shield ? 0 : 1,
        5: 1,
        6: shield >=2 ? 1: 2,
    }

    return table[dice] ?? 0;
};

export function calculateDamage(
    bogey: BogeyState,
    dice: number[]
) {
    // all is beams right now
    let die_to_damage = beamDamage(
        Math.max(
        ...(bogey.weaponry.shields
            .filter( shield => !shield.damaged)
            .map( ({level}) => level ))
        )
    );

    let damage = _.sum(dice.map(die_to_damage));

    return damage;
}
