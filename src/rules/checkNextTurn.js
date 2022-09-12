function checkTurn0(getState, dispatch) {
	const players = Object.fromEntries(
		getState().game.players.map(({ name }) => [name, false]),
	);

	if (Object.keys(players).length === 0) return;

	getState()
		.bogeys.filter(({ orders }) => orders.length > 0)
		.map(({ player }) => player)
		.forEach((p) => (players[p] = true));

	if (Object.values(players).every((x) => x)) dispatch.playNextTurn();
}

export const checkNextTurn = ({ getState, dispatch }) => (next) => (action) => {
	next(action);

	// if turn 0, we have players *and* ships for each of them
	if (getState().game.turn === 0) return checkTurn0(getState, dispatch);

	// for next turns, all active bogeys have orders
	if (getState.activeBogeys().every((bogey) => bogey.orders.length > 0))
		dispatch.playNextTurn();
};
