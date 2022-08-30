import u from 'updeep';
import fp from 'lodash/fp.js';
import _ from 'lodash';
import { produce } from 'immer';

//import bogey from '..';

// import { any } from '../navigation';
// import { DuxState } from 'updux';

export const round = (n: number) => _.round(n, 2);

//type BogeyState = DuxState<typeof bogey>;

type Coords = [number, number];

type MovementType = 'thrust' | 'turn' | 'bank';

type Trajectory = TrajectoryEntry[];

type TrajectoryEntry =
	| { type: 'MOVE'; delta: number; coords: Coords }
	| { type: 'POSITION'; coords: Coords };

type MovementOutcome = {
	thrustUsed: number;
	coords: Coords;
	velocity: number;
	/** direction the ship faces */
	heading: number;
	/** the orders, once they've been clamped and normalized */
	effectiveOrders: Record<MovementType, number>;
	trajectory: unknown;
	/** range of values the ship can make */
	maneuvers: Record<MovementType, [number, number]>;
};

type MovementInput = {
	orders?: {
		navigation?: Record<'thrust' | 'bank' | 'turn', number>;
	};
	navigation: {
		coords: Coords;
		heading: number;
		velocity: number;
		trajectory?: Trajectory;
	};
    structure: {
        drive: {
            current: number;
        }
    };
};

const upush = (new_item: any) => (state = []) => [...state, new_item];

export function moveThrust(navigation: any, thrust = 0): any {
	if (!thrust) return navigation;

	const angle = (navigation.heading * Math.PI) / 6;
	const delta = [Math.sin(angle), Math.cos(angle)]
		.map((x) => thrust * x)
		.map(round);

	const coords = _.zip(navigation.coords, delta).map(_.sum).map(round);

	return u(
		{
			trajectory: upush({ type: 'MOVE', delta, coords }),
			coords,
		},
		navigation,
	);

	return produce(navigation, (draft) => {
		draft.trajectory.push({ type: 'MOVE', delta, coords });
		draft.coords = coords;
	});
}

export function moveBank(movement: any, velocity: number): any {
	const angle = ((movement.heading + 3) * Math.PI) / 6;
	const delta = [Math.sin(angle), Math.cos(angle)]
		.map((x) => velocity * x)
		.map(round);

	const coords = _.zip(movement.coords, delta).map(_.sum).map(round);

	return u({
		trajectory: u.withDefault([], upush({ type: 'BANK', delta, coords })),
		coords,
	})(movement);
}

/**
 * returns a heading between [0,12[
 */
function canonicalHeading(heading: number): number {
	heading %= 12;

	if (heading < 0) heading += 12;

	return heading;
}

export function moveRotate(movement: any, angle: number): any {
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

function two_steps(n: number): [number, number] {
	const split: [number, number] = [_.floor(n / 2), _.ceil(n / 2)];

	if (n < 0) split.reverse();

	return split;
}

// returns the course of the ship
export function plotMovement(ship: MovementInput): MovementOutcome {
	let navigation = fp.omit(['course'], ship.navigation);

	let { thrust = 0, turn = 0, bank = 0 } = ship?.orders?.navigation ?? {};

	navigation.trajectory = [{ type: 'POSITION', coords: navigation.coords! }];

	const engine_rating = ship?.structure?.drive?.current ?? 0;

	let engine_power = engine_rating;

	const thrust_range: [number, number] = [
		Math.max(-engine_power, -(navigation.velocity ?? 0)),
		engine_power,
	];

	const clamp_thrust = (t: number): number =>
		_.clamp(t, thrust_range[0], thrust_range[1]);

	if (thrust) {
		thrust = clamp_thrust(thrust);
		navigation = u({ velocity: (v: number) => v + (thrust as number) })(
			navigation,
		);
		engine_power -= Math.abs(thrust);
	}

	if (turn) {
		const max: number = _.min([
			_.floor(engine_rating / 2),
			engine_power,
		]) as number;
		turn = _.clamp(turn, -max, max);
		engine_power -= Math.abs(turn);
	}

	if (bank) {
		const max: number = _.min([
			_.floor(engine_rating / 2),
			engine_power,
		]) as number;
		bank = _.clamp(bank, -max, max);
		engine_power -= Math.abs(bank);

		navigation = moveBank(navigation, bank);
	}

	if (turn) {
		const thr = two_steps(navigation.velocity ?? 0);
		const t = two_steps(turn);

		_.zip(t, thr).forEach((m) => {
			navigation = moveThrust(
				moveRotate(navigation, m[0] as number),
				m[1] as number,
			);
		});
	} else {
		navigation = moveThrust(navigation, navigation.velocity);
	}

	const sym_range = (x: number) => [-x, x] as [number, number];
	const side_maneuver = (current: number): [number, number] =>
		sym_range(
			fp.min([
				Math.abs(current) + engine_power,
				_.floor(engine_rating / 2),
			]) as number,
		);

	const max_thrust = Math.abs(thrust) + engine_power;

	const maneuvers: Record<MovementType, [number, number]> = {
		thrust: [
			fp.max([-max_thrust, -ship.navigation.velocity]) as number,
			max_thrust,
		],
		bank: side_maneuver(bank),
		turn: side_maneuver(turn),
	};

	return {
		thrustUsed: engine_rating - engine_power,
		trajectory: navigation.trajectory,
		maneuvers,
		heading: navigation.heading!,
		coords: navigation.coords!,
		velocity: navigation.velocity!,
		effectiveOrders: { thrust, bank, turn },
	};
}

export default plotMovement;
