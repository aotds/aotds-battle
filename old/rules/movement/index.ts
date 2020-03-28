import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';
import { NavOrdersState } from '../../store/bogeys/bogey/orders/types';
import { BogeyState } from '../../store/bogeys/bogey/types';
import { NavigationState } from '../../store/bogeys/bogey/navigation/types';

import { oc } from 'ts-optchain';

const upush = (new_item: any) => (state = []) => [...state, new_item];

type BogeyMovement = Pick<BogeyState, 'navigation' | 'drive' | 'orders'>;

// course
// trajectory


const roundCoords = (coords: [number, number]) => coords.map(x => _.round(x, 2));

export function move_thrust(navigation: NavigationState, thrust: number): NavigationState {
    const angle = (navigation.heading * Math.PI) / 6;
    const delta = [Math.sin(angle), Math.cos(angle)].map(x => thrust * x);

    const coords = roundCoords(_.zip(navigation.coords, delta).map(_.sum) as any);

    return u.if(thrust, {
        trajectory: upush({ type: 'MOVE', delta, coords }),
        coords,
    })(navigation) as NavigationState;
}

export function move_bank(movement: NavigationState, velocity: number): NavigationState {
    const angle = ((movement.heading + 3) * Math.PI) / 6;
    const delta = [Math.sin(angle), Math.cos(angle)].map(x => velocity * x);

    const coords = roundCoords(_.zip(movement.coords, delta).map(_.sum) as any);

    return u({
        trajectory: u.withDefault([], upush({ type: 'BANK', delta, coords })),
        coords,
    })(movement) as NavigationState;
}

/**
 * returns a heading between [0,12[
 */
function canonicalHeading(heading: number): number {
    heading %= 12;

    if (heading < 0) heading += 12;

    return heading;
}

export function move_rotate(movement: NavigationState, angle: number): NavigationState {
    const heading = canonicalHeading(movement.heading + angle);

    return u({
        trajectory: upush({
            type: 'ROTATE',
            delta: angle,
            heading,
        }),
        heading,
    })(movement) as NavigationState;
}

function two_steps(n: number): [number, number] {
    const split: [number, number] = [_.floor(n / 2), _.ceil(n / 2)];

    if (n < 0) split.reverse();

    return split;
}
