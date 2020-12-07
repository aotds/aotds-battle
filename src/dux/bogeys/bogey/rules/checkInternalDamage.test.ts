import tap from 'tap';

import checkInternalDamage from './checkInternalDamage';
import { inflateBogey } from '..';
import * as dice from '../../../../dice';

(dice as any).rollDice = () => [10];

const res = checkInternalDamage(inflateBogey({ drive: 6, structure: { hull: 10 },
weaponry: {
    firecons: 2,
    shields: [ 1,2],
    weapons: [
        {},{}
    ]
}}) as any, 2);

tap.is(res.length, 7);
