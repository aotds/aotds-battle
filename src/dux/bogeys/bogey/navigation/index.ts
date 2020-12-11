import Updux from 'updux';

import * as actions from './actions';

const dux = new Updux({
    initial: {
        coords: [0, 0],
        heading: 0,
        velocity: 0,
    },
    actions,
});

dux.addMutation(dux.actions.bogey_movement_res, ({ movement }) => () => movement);

export default dux.asDux;
