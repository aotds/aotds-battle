import { BattleDux } from '../../../../BattleDux.js';

export const dux = new BattleDux({
	initial: {
		coords: [0, 0],
		heading: 0,
		velocity: 0,
	},
	actions: {
		bogeyMovementResolution: (bogeyId, movement) => ({ bogeyId, movement }),
	},
});

export default dux;

dux.setMutation('bogeyMovementResolution', ({ movement }) => () => movement);

dux.setInflator((shorthand) => shorthand ?? dux.initial);
