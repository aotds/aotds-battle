import Updux from 'updux';
import fp from 'lodash/fp';
import u from 'updeep';
import { action, empty, payload } from 'ts-action';

import { metaTimestampDux } from './metaTimestamp';
import actionId, { actionIdEffect } from './game/actionId';
import subactions from './subactions';
import playPhases from './playPhases';
import gameInit from './gameInit';

type State = {
    game: {
        next_action_id: number
    }
}

const dux = new Updux({
    initial: {} as State,
    coduxes: [metaTimestampDux, playPhases, gameInit ],
    subduxes: { 'game.next_action_id': actionId },
    effects: [['*', actionIdEffect(state => state?.game?.next_action_id)]],
});
export default dux;

