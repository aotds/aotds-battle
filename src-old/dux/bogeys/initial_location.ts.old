import _ from 'lodash';
import fp from 'lodash/fp';
import { V } from '../../Vector';
import {BogeyState} from './bogey';
import { round } from './bogey/rules/plotMovement';


type Coords = [number, number];

export function initial_location(
    ship: BogeyState,
    others: BogeyState[] = [],
): {
    coords: Coords;
    heading: number;
    velocity: number;
} {
    let nav = {
        coords: [_.random(-100, 100), _.random(-100, 100)] as Coords,
        heading: _.random(0, 11),
        velocity: 0,
    };

    if (others.length === 0) {
        return nav;
    }

    const player_id = ship.player_id;
    if (player_id) {
        const friends = fp.filter({ player_id }, others);
        if (friends.length > 0) {
            const friend = fp.sample(friends) as BogeyState;
            nav.heading = friend.navigation.heading + _.random(-2, 2);
            nav.coords = [...friend.navigation.coords] as Coords;
        }
    }

    const objects = others.map(obj => ({
        coords: obj.navigation.coords,
        min_dist: player_id && player_id === obj.player_id ? 20 : 50,
    }));

    let i = 0;
    while (i++ < 100) {
        const coords = V(nav.coords);
        const too_close = objects.find(obj => coords.distance(obj.coords) <= obj.min_dist);

        // woo! we're done
        if (!too_close) break;

        let repulsion = coords.subtract(too_close.coords);

        if (repulsion.equal([0, 0])) {
            repulsion = V([1, 0]).rotateBy(_.random(0, 11));
        }

        nav.coords = coords
            .add(
                repulsion
                    .normalize()
                    .scale(_.random(5, 15))
                    .rotateBy(_.random(-2, 2), 'arc').v,
            )
            .v.map(round) as Coords;
    }

    return nav;
}
