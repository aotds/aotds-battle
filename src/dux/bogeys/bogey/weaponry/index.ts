import Updux from 'updux';
import u from 'updeep';

import firecons, { inflateFirecons } from './firecons';
import weapons from './weapons';

const weaponryDux = new Updux({
    subduxes: {
        firecons,
        weapons
    }
});

export default weaponryDux.asDux;

export function inflateWeaponry(shorthand:any): typeof weaponryDux.initial {
    return u({
        firecons: inflateFirecons
    })(shorthand) as any
}
