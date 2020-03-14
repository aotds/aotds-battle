import Updux from 'updux';
import fp from 'lodash/fp';
import u from 'updeep';
import { action, empty } from 'ts-action';

import { metaTimestampDux } from './metaTimestamp';
import actionId, { actionIdEffect } from './game/actionId';
import subactions from './subactions';
import playPhases from './playPhases';

const dux = new Updux({
    coduxes: [metaTimestampDux, playPhases],
    subduxes: { 'game.next_action_id': actionId },
    effects: [['*', actionIdEffect(state => state?.game?.next_action_id)]],
});
export default dux;

