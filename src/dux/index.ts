import Updux from 'updux';

import log from './log';
import game from './game';
import bogeys from './bogeys';

import * as actions from './actions';

const battle_dux = new Updux({
    initial: {},
    actions,
    subduxes: {
        log,
        game,
        bogeys,
    },
});

export default battle_dux.asDux;
