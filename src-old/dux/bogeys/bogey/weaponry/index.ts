import { Updux } from 'updux';
import u from 'updeep';

import { dux as firecons, inflate as inflateFirecons } from './firecons';
import { inflate as inflateWeapons } from './weapons';
import { inflate as inflateShields } from './shields';

export const dux = new Updux({
    subduxes: {
        firecons,
    },
});

export const inflate = u({
    firecons: inflateFirecons,
    weapons: inflateWeapons,
    shields: inflateShields,
});
