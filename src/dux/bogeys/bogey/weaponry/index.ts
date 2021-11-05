import { BattleDux } from '../../../../BattleDux';
import { Updux } from 'updux';

import firecons from './firecons';
import shields from './shields';
import weapons from './weapons';

export const dux = new BattleDux({
	initial: {},
	subduxes: {
		firecons,
		shields,
		weapons,
	},
});

export default dux;
