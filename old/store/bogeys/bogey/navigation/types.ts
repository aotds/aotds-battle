export type Coords = [ number, number ];

type Range = [ number, number ];

type TrajectoryPosition = {
    type: 'POSITION',
    coords: Coords
};

type Trajectory = [ TrajectoryPosition ]

export type NavigationState = {
    coords: Coords,
    heading: number,
    velocity: number,
    maneuvers?: {
        thrust: Range,
        turn: Range,
        bank: Range,
    },
    // where we are going with the current orders
    course?: NavigationState,
    // course of last turn
    trajectory?: Trajectory,
    thrust_used?: number;
};
