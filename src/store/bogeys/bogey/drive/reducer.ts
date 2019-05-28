// @format

import u from 'updeep';
import Redactor from '../../../../reducer/redactor';

import { DriveState } from './types';
import { internal_damage } from '../actions';

const redactor = new Redactor({} as DriveState);

// if damage_level == 1 => half of rating
// if damage_level == 2 => 0
const damage_rating = (state: DriveState) => {
    let { damage_level, rating } = state;

    const current = damage_level === 2 ? 0 : Math.floor(rating / 2);

    return u({ current }, state);
};

const inc_damage = u({
    damage_level: (level: number) => Math.min(2, (level || 0) + 1),
});

redactor.addRedaction(internal_damage, ({ payload: { system: { type } } }) =>
    u.if(type === 'drive', (drive: DriveState) => damage_rating(inc_damage(drive))),
);

export const drive_reducer = redactor.asReducer;
export const drive_upreducer = redactor.asUpReducer;
