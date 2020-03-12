import Updux from 'updux';
import { metaTimestampDux } from './metaTimestamp';

const dux = new Updux({
    coduxes: [metaTimestampDux],
});
export default dux;
