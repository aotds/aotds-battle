import Updux from 'updux';
import u from 'updeep';
import { isType, action, empty } from 'ts-action';
import fp from 'lodash/fp';

const dux = new Updux<number>({
    initial: 1,
});
export default dux;
export const actionIdDux = dux;

const inc_action_id = action( 'inc_action_id', empty() );

dux.addMutation( inc_action_id, () => fp.add(1) );

dux.addEffect('*', ({dispatch,actions: {inc_action_id},getState}) => next => action => {
    if( action.type === inc_action_id.type ) return next(action);

    const action_id = getState();
    dispatch(inc_action_id());

    return next( u.updateIn('meta.action_id',action_id,action) );
});
