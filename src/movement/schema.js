type Movement = ShipMovement & {
    trajectory: Array<any>,
};

type ShipMovement = {
    heading: number,
    velocity: number,
    coords: [ number, number ]
};

type Ship = ShipMovement & {
    engine_rating?: number,
};

import type { MovementDirectives } from './Actions';
