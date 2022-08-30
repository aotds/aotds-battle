import u from 'updeep';

import { plotMovement, moveThrust, moveRotate } from './plotMovement.js';

type Coords = [number, number];

test('move_thrust', () => {
	const ship: any = { coords: [0, 0], heading: 1, velocity: 0 };

	const cases: [number, Coords][] = [
		[0, [0, 0]],
		[1, [0.5, 0.87]],
		[10, [5, 8.66]],
	];

	cases.forEach(([thrust, result]: [number, Coords]) => {
		expect(moveThrust(ship, thrust)).toMatchObject({
			coords: result,
		});
	});
});

test('move_rotate', () => {
	const ship = { coords: [0, 0], heading: 0, velocity: 0 } as any;

	[
		[0, 0],
		[1, 1],
		[-1, 11],
		[12, 0],
	].forEach(([turn, heading]) => {
		expect(moveRotate(ship, turn).heading).toEqual(heading);
	});
});

test('simple movements', () => {
	const angle: { [angle: string]: Coords } = {
		0: [0, 10],
		1: [5, 8.66],
		2: [8.66, 5],
		3: [10, 0],
		6: [0, -10],
		9: [-10, 0],
		11: [-5, 8.66],
	};

	const ship = { navigation: { coords: [0, 0], velocity: 10, heading: 0 } };

	for (const a in angle) {
		ship.navigation.heading = +a;
		const movement = plotMovement(ship as any);
		expect(movement).toMatchObject({
			coords: angle[a],
			heading: +a,
		});
	}
});

function moveOk(ship, orders, expected) {
	const navigation = plotMovement(
		u.updateIn('orders.navigation', orders, ship),
	);

	expect(navigation).toMatchObject(expected);
}

test('change of speed', () => {
	const ship = {
		navigation: {
			coords: [0, 0],
			heading: 0,
			velocity: 10,
		},
		drive: { rating: 6, current: 6 },
	} as any;

	// accelerate within engine capacity
	moveOk(ship, { thrust: 6 }, { velocity: 16, coords: [0, 16] });

	// accelerate more than the engine can give
	moveOk(ship, { thrust: 16 }, { velocity: 16, coords: [0, 16] });

	// decelerate
	moveOk(ship, { thrust: -6 }, { velocity: 4, coords: [0, 4] });

	// decelerate to min of zero
	moveOk(
		u.updateIn('navigation.velocity', 2, ship),
		{ thrust: -6 },
		{ velocity: 0, coords: [0, 0] },
	);
});

test('turning', () => {
	const ship = {
		navigation: { coords: [0, 0], velocity: 5, heading: 0 },
		drive: { current: 6 },
	};

	moveOk(
		ship,
		{ turn: 3 },
		{
			coords: [4, 1.73],
			velocity: 5,
			heading: 3,
		},
	);
	moveOk(
		ship,
		{ turn: -3 },
		{
			coords: [-4, 1.73],
			velocity: 5,
			heading: 9,
		},
	);
	moveOk(
		ship,
		{ turn: -9 },
		{
			coords: [-4, 1.73],
			velocity: 5,
			heading: 9,
		},
	);
});

test('banking', () => {
	const ship = {
		navigation: {
			coords: [0, 0],
			velocity: 5,
			heading: 0,
		},
		drive: { current: 6 },
	};

	const tests = [
		[
			'bank while heading at 3',
			u({ navigation: { heading: 3 } })(ship),
			{ bank: -3 },
			{ coords: [5, 3], heading: 3, velocity: 5 },
		],
		[
			'bank of 3',
			ship,
			{ bank: 3 },
			{ coords: [3, 5], heading: 0, velocity: 5 },
		],
		[
			'bank of -3',
			ship,
			{ bank: -3 },
			{ coords: [-3, 5], heading: 0, velocity: 5 },
		],
		[
			"can't bank more than the limit",
			ship,
			{ bank: -9 },
			{ coords: [-3, 5], heading: 0, velocity: 5 },
		],
	];

	tests.forEach(([, ship, orders, expected]) =>
		moveOk(ship, orders, expected),
	);
});

const with_orders = (orders: any) =>
	(u.updateIn as any)('orders.navigation', orders);

test('complex maneuvers', () => {
	const ship = {
		navigation: { coords: [0, 0], velocity: 5, heading: 0 },
		drive: { current: 6 },
	};

	const navigation = plotMovement(
		with_orders({ bank: -1, thrust: -1, turn: 2 })(ship),
	);

	expect(navigation.trajectory).toEqual([
		{ type: 'POSITION', coords: [0, 0] },
		{ type: 'BANK', coords: [-1, 0], delta: [-1, -0] },
		{ type: 'ROTATE', delta: 1, heading: 1 },
		{ type: 'MOVE', coords: [0, 1.73], delta: [1, 1.73] },
		{ type: 'ROTATE', delta: 1, heading: 2 },
		{ type: 'MOVE', coords: [1.73, 2.73], delta: [1.73, 1] },
	]);
});

test('maneuvers', () => {
	const ship = {
		navigation: { coords: [0, 0], velocity: 2, heading: 0 },
		drive: { current: 6 },
	};

	let course = plotMovement(
		with_orders({ bank: -1, thrust: -1, turn: 2 })(ship),
	);

	expect(course.maneuvers).toMatchObject({
		thrust: [-2, 3],
		bank: [-3, 3],
		turn: [-3, 3],
	});

	course = plotMovement(with_orders({ bank: 0, thrust: -1 })(ship));

	expect(course.maneuvers).toMatchObject({
		thrust: [-2, 6],
		bank: [-3, 3],
		turn: [-3, 3],
	});
});

test('course is stable', () => {
	let ship: any = {
		navigation: { coords: [0, 0], velocity: 2, heading: 0 },
		drive: { current: 6 },
	};

	let course: any = plotMovement(
		with_orders({ bank: -1, thrust: -1, turn: 2 })(ship),
	);

	// don't recursively accumulate coursey cruft
	expect(course).not.toHaveProperty('course');

	ship = u.updateIn('navigation.course', u.constant(course), ship);

	expect(ship).not.toHaveProperty('navigation.course.course');

	course = plotMovement(ship);
	expect(course).not.toHaveProperty('course');

	ship = u.updateIn('navigation.course', u.constant(course), ship);
	expect(ship).not.toHaveProperty('navigation.course.course');
});
