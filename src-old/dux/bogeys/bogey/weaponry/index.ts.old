import Updux, { DuxState } from 'updux';
import u from 'updeep';

import firecons from './firecons';
import weapons from './weapons';
import shields from './shields';

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
