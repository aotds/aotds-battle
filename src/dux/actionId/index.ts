import Updux from 'updux';
import u from 'updeep';
import { isType, action, empty } from 'ts-action';

const dux = new Updux({
    initial: 1,
});
export default dux;
export const actionIdDux = dux;

const debug = require('debug')('aots');


const inc_action_id = action( 'inc_action_id', empty() );

dux.addMutation( inc_action_id, () => id => id+1 );

dux.addEffect('*', ({dispatch,actions: {inc_action_id},getState}) => next => action => {
    console.log("???");
    return next(action);
    debug(action);
    if( isType(action, inc_action_id) ) return next(action);

    const action_id = getState();
    dispatch(inc_action_id());

    return next( u.updateIn('meta.action_id',action_id,action) );
});
