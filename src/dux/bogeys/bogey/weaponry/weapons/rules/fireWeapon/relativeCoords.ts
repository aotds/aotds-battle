import { NavigationState } from '../../../../navigation';
import _ from 'lodash';
import fp from 'lodash/fp';

type RelativeCoords = {
    angle: number;
    bearing: number;
    distance: number;
};

export function relativeCoords(ship: NavigationState, target: NavigationState): RelativeCoords {
    const relative = _.zip.apply(null, [ship, target].map(fp.get('coords'))).map((x: any) => x[1] - x[0]);

    const angle = (Math.atan2(relative[0], relative[1]) * 6) / Math.PI;

    const bearing = angle - ship.heading;

    const distance = Math.sqrt(
        relative
            .map(function(x) {
                return Math.pow(x, 2);
            })
            .reduce(function(a, b) {
                return a + b;
            }),
    );

    return { angle, bearing, distance };
}
