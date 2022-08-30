import { Updux } from 'updux';

import { BattleDux } from '../../../../BattleDux.js';
import firecons from './firecons/index.js';
import shields from './shields/index.js';
import weapons from './weapons/index.js';

export const dux = new BattleDux({
	initial: {},
	subduxes: {
		firecons,
		shields,
		weapons,
	},
});

export default dux;
