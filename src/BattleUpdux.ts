import Updux, {UpduxConfig} from 'updux';
import fp from 'lodash/fp';
import u from 'updeep';

const subactions = mw => api => next => action => {
    const parent_actions = [...fp.getOr([], 'meta.parent_actions', action), fp.get('meta.action_id', action)];
    next(action);
    const dispatch = action => api.dispatch(u.updateIn('meta', { parent_actions }, action));
    return mw({ ...api, dispatch })(action);
};

export default class BattleUpdux<
    S = unknown,
    A = null,
    X = unknown,
    C extends UpduxConfig = {}
>  extends Updux<S,A,X,C> {

    constructor(config: C = {} as C) {
        super(config);
    }

    addSubEffect(creator, mw) {
        this.addEffect( creator, subactions(mw) );
    }


}
