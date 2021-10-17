import { Updux, action }  from 'updux';

export const dux = new Updux({
    initial: {
        coords: [0, 0],
        heading: 0,
        velocity: 0,
        thrustUsed: 0,
    },
    actions: {
        bogeyMovementResolution: null
    },
});

dux.addMutation(bogeyMovementResolution, ({ movement }) => () => movement);

