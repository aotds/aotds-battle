import { assess_turn } from './turn';
import { play_turn } from '../store/actions/phases';
const selectors = require('../store/selectors');

import { test_mw } from './test_fixtures';

const debug = require('debug')('aotds:saga');

test('no issued orders, no turn', () => {
	selectors.get_bogeys = jest
		.fn()
		.mockReturnValueOnce(
			['yenzie', 'yanick', ''].map((player_id) => ({ player_id })),
		);

	const res = test_mw(assess_turn);

	expect(res.dispatch).not.toHaveBeenCalled();
});

test('issued orders, turn triggered!', () => {
	selectors.get_bogeys = jest
		.fn()
		.mockReturnValueOnce([
			{ player_id: 'yanick', orders: { issued: true } },
			{ player_id: 'yenzie', orders: { issued: true } },
			{ id: 'asteroid' },
		]);

	const res = test_mw(assess_turn);

	expect(res.dispatch).toHaveBeenCalled();
});
