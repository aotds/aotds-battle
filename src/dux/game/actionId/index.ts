import Updux from 'updux';
import u from 'updeep';
import { action, empty, isType } from 'ts-action';
import fp from 'lodash/fp';

const inc_action_id = action('inc_action_id', empty());

const dux = new Updux({
    initial: 1,
    actions: { inc_action_id },
});
export default dux;
export const actionIdDux = dux;

dux.addMutation(inc_action_id, () => fp.add(1) as any);

export const actionIdEffect: any = selector => ({
    dispatch,
    actions: { inc_action_id },
    getState,
}) => next => action => {
    if (isType(action, inc_action_id)) return next(action);

    const action_id = selector(getState());
    dispatch(inc_action_id());

    return next(u.updateIn('meta.action_id', action_id, action));
};
