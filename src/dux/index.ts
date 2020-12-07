import Updux from 'updux';
import u from 'updeep';

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

battle_dux.addEffect( '*',
    () => next => action =>
        next( u.updateIn( 'meta.timestamp', new Date().toISOString(), action ) )

);

export default battle_dux.asDux;
