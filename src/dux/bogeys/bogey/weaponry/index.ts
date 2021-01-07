import Updux from 'updux';
import u from '@yanick/updeep';

import firecons, { inflate as inflate_firecons } from './firecons';

import { inflate as inflate_weapons } from './weapons';
import { inflate_shields } from './shields';

const weaponry_dux = new Updux({
    subduxes: {
        firecons,
    },
});

export default weaponry_dux.asDux;

export const inflate = u({
    firecons: inflate_firecons,
    weapons: inflate_weapons,
    shields: inflate_shields,
});
