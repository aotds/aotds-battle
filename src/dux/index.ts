import Updux, { coduxes, dux, DuxState } from 'updux';
import fp from 'lodash/fp';
import u from 'updeep';
import { action, empty, payload } from 'ts-action';

import { metaTimestampDux } from './metaTimestamp';
import actionId, { actionIdEffect } from './game/actionId';
import subactions from './subactions';
import playPhases from './playPhases';
import gameInit from './gameInit';
import bogeys from './bogeys';
import log from './log';
import game from './game';

type State = {
    game: {
        next_action_id: number;
    };
};

const battleDux = dux({
    initial: {} as State,
    ...coduxes(metaTimestampDux, playPhases, gameInit),
    subduxes: {
        game,
        bogeys,
        log,
    },
    effects: [['*', actionIdEffect(state => state?.game?.next_action_id)]],
});

export type BattleState = DuxState< typeof battleDux >;

export default battleDux;
