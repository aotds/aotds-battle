import { mw_weapons_firing_phase_inner } from './weapons_firing_phase';
import { test_mw } from './test_fixtures';
import { fire_weapon } from '../store/actions/phases';
import { get_bogey } from '../store/selectors';

jest.mock('../store/selectors');
const selectors = require('../store/selectors');

test('mw_weapons_firing_phase_inner', () => {
	selectors.get_bogeys = jest.fn().mockReturnValueOnce([
		{
			id: 'enkidu',
			weaponry: {
				firecons: [{}, { target_id: 'siduri' }],
				weapons: [
					{ id: 0 },
					{ id: 1, firecon_id: 0 },
					{ id: 2, firecon_id: 1 },
				],
			},
		},
		{
			id: 'no weapons',
			weaponry: {
				firecons: [{}, { target_id: 'siduri' }],
			},
		},
	]);

	selectors.get_bogey = jest
		.fn()
		.mockReturnValueOnce({
			id: 'enkidu',
			weaponry: {
				firecons: [{}, { target_id: 'siduri' }],
				weapons: [
					{ id: 0 },
					{ id: 1, firecon_id: 0 },
					{ id: 2, firecon_id: 1 },
				],
			},
		})
		.mockReturnValueOnce({
			id: 'no weapons',
			weaponry: {
				firecons: [{}, { target_id: 'siduri' }],
			},
		});

	const dispatch = jest.fn();

	test_mw(mw_weapons_firing_phase_inner, { dispatch });

	expect(dispatch).toHaveBeenCalledTimes(1);
	expect(dispatch).toHaveBeenCalledWith(fire_weapon('enkidu', 'siduri', 2));
});
