import { readyForNextTurn } from '.';

describe('try_play_turn', () => {
	test('forced', () => {
		expect(
			readyForNextTurn({
				force: true,
			} as any),
		).toBeTruthy();
	});

	test('not enough active players', () => {
		expect(
			readyForNextTurn({
				getPlayersNotDone: () => [],
				getActivePlayers: () => ['a'],
			} as any),
		).toBeFalsy();
	});

	test('player not done', () => {
		expect(
			readyForNextTurn({
				getPlayersNotDone: () => ['yenzie'],
			} as any),
		).toBeFalsy();
	});

	test('all is good!', () => {
		expect(
			readyForNextTurn({
				getPlayersNotDone: () => [],
				getActivePlayers: () => ['a', 'b'],
			} as any),
		).toBeTruthy();
	});
});
