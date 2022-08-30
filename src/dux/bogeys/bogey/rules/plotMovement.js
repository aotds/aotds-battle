import R from 'remeda';
import u from 'updeep';
import V from '@a-robu/victor';

import { round2 } from '../../rules/fireWeapon/relativeCoords.js';


//import bogey from '..';

// import { any } from '../navigation';
// import { DuxState } from 'updux';

//type BogeyState = DuxState<typeof bogey>;

// type Coords = [number, number];

// type MovementType = 'thrust' | 'turn' | 'bank';

// type Trajectory = TrajectoryEntry[];

// type TrajectoryEntry =
// 	| { type: 'MOVE'; delta; coords: Coords }
// 	| { type: 'POSITION'; coords: Coords };

// type MovementOutcome = {
// 	thrustUsed;
// 	coords: Coords;
// 	velocity;
// 	/** direction the ship faces */
// 	heading;
// 	/** the orders, once they've been clamped and normalized */
// 	effectiveOrders: Record<MovementType, number>;
// 	trajectory: unknown;
// 	/** range of values the ship can make */
// 	maneuvers: Record<MovementType, [number, number]>;
// };

// type MovementInput = {
// 	orders?: {
// 		navigation?: Record<'thrust' | 'bank' | 'turn', number>;
// 	};
// 	navigation: {
// 		coords: Coords;
// 		heading;
// 		velocity;
// 		trajectory?: Trajectory;
// 	};
//     structure: {
//         drive: {
//             current;
//         }
//     };
// };

const upush = (new_item) => (state = []) => [...state, new_item];
const sum = (args) => args.reduce( (a,b) => a + b );

export function moveThrust(navigation, thrust = 0){
	if (!thrust) return navigation;

    const delta = V(0,1).rotate(-navigation.heading/6 * Math.PI )
            .multiply(V(thrust, thrust));


    const coords = V.fromArray(navigation.coords).add(delta);

	return u(
		{
			trajectory: upush({ type: 'MOVE', delta: delta.toArray().map(round2),
                coords: coords.toArray().map(round2) }),
			coords: coords.toArray().map(round2),
		},
		navigation,
	);
}

export function moveBank(movement, velocity){
	const angle = ((movement.heading + 3) * Math.PI) / 6;
	const delta = [Math.sin(angle), Math.cos(angle)]
		.map((x) => velocity * x)
		.map(round2);

	const coords = R.zip(movement.coords, delta).map(sum).map(round2);

	return u({
		trajectory: u.withDefault([], upush({ type: 'BANK', delta, coords })),
		coords,
	})(movement);
}

/**
 * returns a heading between [0,12[
* @returns number
* @param {number} - heading
 */
function canonicalHeading(heading){
	heading %= 12;

	if (heading < 0) heading += 12;

	return heading;
}

export function moveRotate(movement, angle){
	const heading = canonicalHeading(movement.heading + angle);

	return u({
		trajectory: upush({
			type: 'ROTATE',
			delta: angle,
			heading,
		}),
		heading,
	})(movement);
}

function two_steps(n){
	const split= [Math.floor(n / 2), Math.ceil(n / 2)];

	if (n < 0) split.reverse();

	return split;
}

// returns the course of the ship
export function plotMovement(ship){
	let navigation = R.omit(ship.navigation,['course']);

	let { thrust = 0, turn = 0, bank = 0 } = ship?.orders?.navigation ?? {};

	navigation.trajectory = [{ type: 'POSITION', coords: navigation.coords }];

	const engine_rating = ship?.drive?.current ?? 0;

	let engine_power = engine_rating;

	const thrust_range= [
		Math.max(-engine_power, -(navigation.velocity ?? 0)),
		engine_power,
	];

	const clamp_thrust = (t)=>
		R.clamp(t, {min: thrust_range[0], max:thrust_range[1]});

	if (thrust) {
		thrust = clamp_thrust(thrust);
		navigation = u({ velocity: (v) => v + thrust })(
			navigation,
		);
		engine_power -= Math.abs(thrust);
	}

	if (turn) {
		const max= Math.min(
			Math.floor(engine_rating / 2),
			engine_power,
		);
		turn = R.clamp(turn, {min:-max, max});
		engine_power -= Math.abs(turn);
	}

	if (bank) {
		const max = Math.min(
			Math.floor(engine_rating / 2),
			engine_power,
		);
		bank = R.clamp(bank, {min:-max, max});
		engine_power -= Math.abs(bank);

		navigation = moveBank(navigation, bank);
	}

	if (turn) {
		const thr = two_steps(navigation.velocity ?? 0);
		const t = two_steps(turn);

		R.zip(t, thr).forEach((m) => {
			navigation = moveThrust(
				moveRotate(navigation, m[0] ),
				m[1] ,
			);
		});
	} else {
		navigation = moveThrust(navigation, navigation.velocity);
	}

	const sym_range = (x) => [-x, x];
	const side_maneuver = (current)=>
		sym_range(
			Math.min(
				Math.abs(current) + engine_power,
				Math.floor(engine_rating / 2),
			) ,
		);

	const max_thrust = Math.abs(thrust) + engine_power;

	const maneuvers= {
		thrust: [
			Math.max(-max_thrust, -ship.navigation.velocity) ,
			max_thrust,
		],
		bank: side_maneuver(bank),
		turn: side_maneuver(turn),
	};

	return {
		thrustUsed: engine_rating - engine_power,
		trajectory: navigation.trajectory,
		maneuvers,
		heading: navigation.heading,
		coords: navigation.coords,
		velocity: navigation.velocity,
		effectiveOrders: { thrust, bank, turn },
	};
}

export default plotMovement;
