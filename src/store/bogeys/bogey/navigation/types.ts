export type Coords = [ number, number ];

type Range = [ number, number ];

type TrajectoryPosition = {
    type: 'POSITION',
    coords: Coords
};

export type NavigationState = {
    coords: Coords,
    heading: number,
    velocity: number,
    maneuvers?: {
        thrust: Range,
        turn: Range,
        bank: Range,
    },
    trajectory?: [
        TrajectoryPosition
    ],
};
