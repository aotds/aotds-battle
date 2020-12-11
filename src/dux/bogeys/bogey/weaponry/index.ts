import Updux from 'updux';
import u from 'updeep';

import firecons, {
    inflate as inflate_firecons
} from './firecons';

const weaponry_dux = new Updux({
    subduxes: {
        firecons,
    }
});

export default weaponry_dux.asDux;

export const inflate = u({
    firecons: inflate_firecons
})
