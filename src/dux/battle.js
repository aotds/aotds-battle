import { BDux } from '../BDux.js';

import { dux as actionId, addActionIdEffect } from './actionId.js';
import { dux as log } from './log.js';
import { gameDux as game } from './game.js';
import bogeys from './bogeys';
import { checkNextTurn } from '../rules/checkNextTurn';

export const battleDux = new BDux({
	subduxes: {
		actionId,
		log,
		game,
        bogeys,
	},
});

battleDux.addEffect('*', addActionIdEffect);

// TODO * is too generic?
battleDux.addEffect('*', checkNextTurn);
