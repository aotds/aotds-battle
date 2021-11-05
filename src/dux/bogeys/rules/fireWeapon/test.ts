import { fireWeapon } from '.';

jest.mock('../../../../dice');
import * as dice from '../../../../dice';

const rollDice: any = dice.rollDice;
rollDice.mockReturnValueOnce([6]);
rollDice.mockReturnValueOnce([6, 1]);

test('basic', () => {
	const attacker = { coords: [0, 0], heading: 0, velocity: 0 };
	const target = { coords: [10, 1], heading: 6, velocity: 0 };

	const result = fireWeapon(attacker as any, target as any, {
		id: 2,
		weaponType: 'beam',
		weaponClass: 1,
		arcs: ['FS'],
	});

	expect(result).toMatchObject({
		damageDice: [6],
		penetratingDamageDice: [6, 1],
	});
});
