import { BDux } from '../BDux.js';

import { dux as actionId, addActionIdEffect } from './actionId.js';
import { dux as log } from './log.js';

export const battleDux = new BDux({
	subduxes: {
		actionId,
		log,
	},
});

battleDux.addEffect('*', addActionIdEffect);
