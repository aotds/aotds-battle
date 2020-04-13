// @format

import _ from 'lodash';
import u from 'updeep';
import fp from 'lodash/fp';

import { WeaponState } from '../store/bogeys/bogey/weaponry/weapon/reducer';
import { BogeyState } from '../store/bogeys/bogey/types';
import { arc_ranges, Arc } from '../store/constants';
import roll_dice from '../dice';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';
import { oc } from 'ts-optchain';
import { FireWeaponOutcome } from './types';
import { ShieldState } from '../store/bogeys/bogey/structure/types';


type FWBogey = Pick<BogeyState, 'navigation' | 'drive'>;

function in_arcs(arcs: Arc[], angle: number) {
    return _.flatten(_.values(_.pick(arc_ranges, arcs))).some((arc: any) => angle >= arc[0] && angle <= arc[1]);
}
export function fire_weapon(
    attacker: FWBogey | undefined,
    target: FWBogey | undefined,
    weapon: WeaponState | undefined,
)

const beam_damage_table = { 4: 1, 5: 1, 6: 2 };

const beam_damage = (shield = 0) => (dice: number) => {
    let table = u({
        4: u.if(shield, 0),
        6: u.if(shield >= 2, 1),
    })(beam_damage_table);

    return table[dice] || 0;
};

export function weapon_damage(
    bogey: BogeyState,
    dice: number[],
    is_penetrating: boolean = false,
): {
    damage: number;
    is_penetrating: boolean;
} {
    // all is beams right now
    let bd = beam_damage(
        _.max(
            oc(bogey)
                .structure.shields([])
                .filter((s: ShieldState) => !s.damaged)
                .map(s => s.level),
        ),
    );

    let damage = _.sum(dice.map(d => bd(d)));

    return { damage, is_penetrating };
}
