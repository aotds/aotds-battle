import { Updux } from 'updux';
import u from 'updeep';

import { dux as firecons, inflate as inflate_firecons } from './firecons';

import { inflate as inflate_weapons } from './weapons';
import { inflate_shields } from './shields';

export const dux = new Updux({
    subduxes: {
        firecons,
    },
});

export const inflate = u({
    firecons: inflate_firecons,
    weapons: inflate_weapons,
    shields: inflate_shields,
});
