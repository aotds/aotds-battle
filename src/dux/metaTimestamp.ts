import Updux from 'updux';
import u from 'updeep';
import fp from 'lodash/fp';


const dux = new Updux({});
export default dux;
export const metaTimestampDux = dux;

const addTimestamp = fp.set( 'meta.timestamp', new Date().toISOString() );

function p(initial: unknown, ...steps: Function[] ) {
    return steps.reduce( (a,b) => b(a), initial );
}

dux.addEffect('*', () => next => action => p(action,addTimestamp,next));
