import _ from 'lodash';
import fp from 'lodash/fp';

export function relativeCoords(ship, target) {
    const relative = _.zip.apply(null, [ship, target].map(fp.get('coords'))).map((x: any) => x[1] - x[0]);

    const angle = _.round((Math.atan2(relative[0], relative[1]) * 6) / Math.PI, 2);

    const bearing = angle - ship.heading;

    const distance = _.round(
        Math.sqrt(
            relative
                .map(function(x) {
                    return Math.pow(x, 2);
                })
                .reduce(function(a, b) {
                    return a + b;
                }),
        ),
        2,
    );

    return { angle, bearing, distance };
}
