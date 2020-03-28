import Updux, { DuxState } from 'updux';
import { action, payload } from 'ts-action';
import orders from './orders';
import u from 'updeep';

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
export type BogeyState = {
    id: string;
    name: string;
    player_id?: string;
    orders: DuxState<typeof orders>;
    navigation: NavigationState;
    drive: {
        rating: number;
        current: number;
    }
};

//--- actions

const bogey_movement = action('bogey_movement', payload<string>());
const bogey_movement_move = action('bogey_movement_move', (bogey_id: string, course: unknown) => ({
    payload: { bogey_id, course },
}));

// ---

const dux = new Updux({
    initial: { id: '', name: '', navigation: {} } as BogeyState,
    actions: { bogey_movement, bogey_movement_move },
    subduxes: {
        orders,
    },
});

export default dux.asDux;
