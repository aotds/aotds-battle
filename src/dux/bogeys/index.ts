import Updux from '../../BattleUpdux';
import { init_game } from '../game/actions';
import { add_bogey } from './actions';

const bogeys_dux = new Updux({
    initial: [],
    actions: {
        init_game,
        add_bogey,
    },
});

bogeys_dux.addSubEffect(init_game, ({ dispatch }) => ({ payload: { bogeys = [] } }) => {
    bogeys.forEach(bogey => dispatch(add_bogey(bogey)));
});

bogeys_dux.addMutation(add_bogey, (ship => (state: unknown[]) => [...state, ship]) as any);

export default bogeys_dux.asDux;
