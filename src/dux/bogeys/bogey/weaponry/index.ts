import Updux, { DuxState } from 'updux';
import u from 'updeep';

import firecons, { inflateFirecons } from './firecons';
import weapons, { inflateWeapons } from './weapons';

const weaponryDux = new Updux({
    subduxes: {
        firecons,
        weapons,
    },
});

export default weaponryDux.asDux;

export function inflateWeaponry(shorthand): DuxState<typeof weaponryDux> {
    return u({
        firecons: inflateFirecons,
        weapons: inflateWeapons,
    })(shorthand) as any;
}
