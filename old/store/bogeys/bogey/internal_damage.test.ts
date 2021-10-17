import bogey_reducer from './reducer';
import { inflate_bogey } from './inflate';
import { internal_damage } from '../../../actions/bogey';

const sample_bogey = inflate_bogey({
	id: 'enkidu',
	drive: 4,
	weaponry: {
		firecons: [{ id: 0 }, { id: 1 }],
		weapons: [{ id: 0 }, { id: 1 }],
	},
	structure: {
		shields: [1, 2],
	},
} as any);

describe('internal damage', () => {
	test('drive', () => {
		let bogey = bogey_reducer(
			sample_bogey as any,
			internal_damage('enkidu', 'drive'),
		);

		expect(bogey).toHaveProperty('drive.damage_level', 1);
		expect(bogey).toHaveProperty('drive.current', 2);

		// damage doesn't bleed to other systems
		expect(bogey).not.toHaveProperty('weaponry.firecons.0.damaged', true);

		// boom! again
		bogey = bogey_reducer(bogey, internal_damage('enkidu', 'drive'));

		expect(bogey).toHaveProperty('drive.damage_level', 2);
		expect(bogey).toHaveProperty('drive.current', 0);

		// can't go worse than 2
		bogey = bogey_reducer(bogey, internal_damage('enkidu', 'drive'));

		expect(bogey).toHaveProperty('drive.damage_level', 2);
		expect(bogey).toHaveProperty('drive.current', 0);
	});
	test('firecons', () => {
		let bogey = bogey_reducer(
			sample_bogey as any,
			internal_damage('enkidu', ['firecon', 1]),
		);

		expect(bogey).toHaveProperty('weaponry.firecons.1.damaged', true);

		// damage doesn't bleed to other systems
		expect(bogey).not.toHaveProperty('drive.damage_level');
	});
	test('weapons', () => {
		let bogey = bogey_reducer(
			sample_bogey as any,
			internal_damage('enkidu', ['weapon', 1]),
		);

		expect(bogey).toHaveProperty('weaponry.weapons.1.damaged', true);
	});
	test('firecons', () => {
		let bogey = bogey_reducer(
			sample_bogey as any,
			internal_damage('enkidu', ['firecon', 1]),
		);

		expect(bogey).toHaveProperty('weaponry.firecons.1.damaged', true);

		// damage doesn't bleed to other systems
		expect(bogey).not.toHaveProperty('drive.damage_level');
	});
	test('shields', () => {
		let bogey = bogey_reducer(
			sample_bogey as any,
			internal_damage('enkidu', ['shield', 1]),
		);

		expect(bogey).toHaveProperty('structure.shields.1.damaged', true);
	});
});
