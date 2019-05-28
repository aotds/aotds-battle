// @format

import u from 'updeep';
import _ from 'lodash';
import { BogeyStateShorthand, BogeyState } from './types';
import { inflate_structure as structure } from './structure/inflate';
import { inflate_drive as drive } from './drive/inflate';
import { WeaponState } from './weaponry/weapon/reducer';

const inflater = {
    structure,
    drive,
    weaponry: {
        firecons: u.if(_.isNumber, (nbr: number) => _.times(nbr).map(i => ({ id: i }))),
        weapons: u.map((w: WeaponState, id: number) => ({ ...w, id })),
    },
};

export function inflate_bogey(bogey: BogeyStateShorthand): BogeyState {
    return u(inflater)(bogey);
}
