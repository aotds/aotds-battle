import Updux from 'updux';
import u from 'updeep';

const dux = new Updux();
export default dux;

const addTimestamp = u.updateIn('meta.timestamp', new Date().toISOString());

dux.addEffect('*', () => next => action => next(addTimestamp(action)));
