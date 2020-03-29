import Updux from 'updux';
import {action, payload} from 'ts-action';

export type Coords = [ number, number ];

type Range = [ number, number ];

type TrajectoryPosition = {
    type: 'POSITION',
    coords: Coords
};

type Trajectory = TrajectoryPosition[];


export type NavigationState = {
    coords: Coords,
    heading: number,
    velocity: number,
    // where we are going with the current orders
    course?: NavigationState,
    // course of last turn
    trajectory?: Trajectory,
    thrust_used?: number;
    maneuvers?: { // in what ranges the value can be modified to (for UIs)
        thrust: Range,
        turn: Range,
        bank: Range,
    },
};

// -- actions

const bogey_movement_move = action('bogey_movement_move', (bogey_id: string, course: NavigationState) => ({
    payload: { bogey_id, course },
}));

// ---

const navigationDux = new Updux({
    initial: {
        coords: [0,0],
        heading: 0,
        velocity: 0,
    } as NavigationState,
    actions: {
        bogey_movement_move
    }
});

navigationDux.addMutation(
    bogey_movement_move, ({ course }) => () => course
)


export default navigationDux.asDux;
