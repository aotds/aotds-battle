import Updux from 'updux';
import { metaTimestampDux } from './metaTimestamp';
import actionId from './game/actionId';

const dux = new Updux({
    coduxes: [metaTimestampDux],
    subduxes: { 'game.next_action_id': actionId }
});
export default dux;
