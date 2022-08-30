import R from 'remeda';

export const round2 = numb => Math.round(numb*100)/100;

export function relativeCoords(ship, target) {
    const relative = R.zip(
        ...[ship, target].map( R.prop('coords') )
    ).map( ([a,b] ) => b - a ) ;

	const angle = round2(
		(Math.atan2(relative[0], relative[1]) * 6) / Math.PI
	);

	const bearing = round2(angle - ship.heading);

	const distance = round2(
		Math.sqrt(
			relative
				.map(x => x*x)
				.reduce( (a, b) => a+b
				),
		),
		2,
	);

	return { angle, bearing, distance };
}
