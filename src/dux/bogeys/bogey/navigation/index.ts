import Updux, { DuxState } from 'updux';

import * as actions from './actions';

const dux = new Updux({
    initial: {
        coords: [0, 0],
        heading: 0,
        velocity: 0,
        thrust_used: 0,
    },
    actions,
});

dux.addMutation(dux.actions.bogey_movement_res, ({ movement }) => () => movement);

export type NavigationState = DuxState<typeof dux>;

export default dux.asDux;
