// @format
import { inflate_structure } from './inflate';
import { structure_reducer } from './reducer';
import { StructureState } from './types';
import { noop } from '../../../actions/misc';
import { internal_damage } from '../actions';
import { Action } from '../../../../reducer/types';

test('inflate', () => {
	expect(
		inflate_structure({
			armor: 6,
			hull: 4,
			shields: [1, 1, 2],
		}),
	).toMatchObject({
		armor: { current: 6, rating: 6 },
		hull: { current: 4, rating: 4 },
		shields: [
			{ id: 0, level: 1 },
			{ id: 1, level: 1 },
			{ id: 2, level: 2 },
		],
	});
});

test('reducer', () => {
	const struct = inflate_structure({ armor: 6, hull: 8, shields: [1, 2] });

	structure_reducer(struct, noop());
});

test('shields', () => {
	let struct = inflate_structure({ armor: 6, hull: 8, shields: [1, 2] });

	struct = structure_reducer(
		struct,
		internal_damage('enkidu', ['shield', 1], true),
	);

	expect(struct).toHaveProperty('shields.1.damaged', true);
	expect(struct).not.toHaveProperty('shields.0.damaged');
});

describe('damage', () => {
	const tests = [
		{ action: { damage: 1, is_penetrating: false }, hull: 10, armor: 1 },
		{ action: { damage: 2, is_penetrating: false }, hull: 9, armor: 1 },
		{ action: { damage: 6, is_penetrating: false }, hull: 6, armor: 0 },
		{ action: { damage: 6, is_penetrating: true }, hull: 4, armor: 2 },
	];

	tests.forEach(({ action, hull, armor }) =>
		test(JSON.stringify(action), () =>
			expect(
				structure_reducer(
					{
						hull: { current: 10 },
						armor: { current: 2 },
					} as StructureState,
					{
						type: 'DAMAGE',
						payload: action,
					} as Action,
				),
			).toMatchObject({
				hull: { current: hull },
				armor: { current: armor },
			}),
		),
	);

	test('destroy', () => {
		expect(
			structure_reducer(
				{
					hull: { current: 10 },
					armor: { current: 2 },
				} as StructureState,
				{
					type: 'DAMAGE',
					payload: { damage: 12 },
				} as Action,
			),
		).toHaveProperty('destroyed', true);
	});
});
