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

dux.addEffect(
    '*', ({
    dispatch,
    actions: { inc_action_id },
    getState,
}) => next => action => {
    // we don't want an infinite loop, do we?
    if (isType(action, inc_action_id)) return next(action);

    const action_id = getState();
    dispatch(inc_action_id());

    return next(u.updateIn('meta.action_id', action_id, action));
}
);
