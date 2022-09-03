import { Updux } from 'updux';

import { BDux } from '../../../../BDux.js';
import firecons from './firecons/index.js';
import shields from './shields/index.js';
import weapons from './weapons/index.js';

export const dux = new BDux({
	initial: {},
	subduxes: {
		firecons,
		shields,
		weapons,
	},
});

export default dux;
