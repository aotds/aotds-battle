import Updux, { DuxState } from 'updux';
import u from 'updeep';

import firecons, { inflateFirecons } from './firecons';
import weapons, { inflateWeapons } from './weapons';
import shields, { inflateShields } from './shields';

const weaponryDux = new Updux({
    subduxes: {
        firecons,
        weapons,
        shields,
    },
    selectors: {
        firecons: state => state.firecons
    }
});

export default weaponryDux.asDux;

export function inflateWeaponry(shorthand): DuxState<typeof weaponryDux> {
    return u({
        firecons: inflateFirecons,
        weapons: inflateWeapons,
        shields: inflateShields,
    })(shorthand) as any;
}
