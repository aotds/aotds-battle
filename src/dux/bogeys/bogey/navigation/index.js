import { Updux, action }  from 'updux';

/** @type { import('./types').BogeyMovementResolution } */
const bogeyMovementResolution = action(
    'bogeyMovementResolution'
);

export const dux = new Updux({
    initial: {
        coords: [0, 0],
        heading: 0,
        velocity: 0,
        thrust_used: 0,
    },
    actions: {
        bogeyMovementResolution
    },
});

dux.addMutation(bogeyMovementResolution, ({ movement }) => () => movement);

