import u from 'updeep';
import fp from 'lodash/fp';
import _ from 'lodash';

//import bogey from '..';

// import { any } from '../navigation';
// import { DuxState } from 'updux';

export const round = (n: number) => _.round(n, 2);

//type BogeyState = DuxState<typeof bogey>;

const upush =
	(new_item: any) =>
	(state = []) =>
		[...state, new_item];

export function moveThrust(navigation: any, thrust: number): any {
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
export function plotMovement(ship): any {
	let navigation = fp.omit(['course'], ship.navigation);

	const orders = ship?.orders?.navigation ?? {};

	navigation = u(
		{ trajectory: [{ type: 'POSITION', coords: navigation.coords }] },
		navigation,
	);

	let { thrust = 0, turn = 0, bank = 0 } = orders;

	const engine_rating = ship?.drive?.current ?? 0;

	let engine_power = engine_rating;

	const thrust_range: [number, number] = [
		Math.max(-engine_power, -navigation.velocity),
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
		const thr = two_steps(navigation.velocity);
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

	// navigation = u({ trajectory: upush({
	//     type: 'POSITION', coords: navigation.coords
	// })})(navigation);

	const sym_range = (x: number) => [-x, x];
	const side_maneuver = (current: number): number[] =>
		sym_range(
			fp.min([
				Math.abs(current) + engine_power,
				_.floor(engine_rating / 2),
			]) as number,
		);

	const max_thrust = Math.abs(thrust) + engine_power;

	const maneuvers = {
		thrust: [fp.max([-max_thrust, -ship.navigation.velocity]), max_thrust],
		bank: side_maneuver(bank),
		turn: side_maneuver(turn),
	};

	return u(
		{
			thrust_used: engine_rating - engine_power,
			maneuvers,
			coords: u.map(round),
			orders: {
				thrust,
				turn,
				bank,
			},
		} as unknown,
		navigation,
	);
}

export default plotMovement;
