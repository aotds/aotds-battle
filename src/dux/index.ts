import { Updux } from 'updux';

import { dux as game } from './game';
import { dux as bogeys } from './bogeys';

export const dux = new Updux({
	actions: {},
	subduxes: {
		game,
		bogeys,
	},
});
