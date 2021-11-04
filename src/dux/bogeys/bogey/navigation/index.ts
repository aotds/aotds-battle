import { defaults } from 'lodash/fp';
import { BattleDux } from '../../../../BattleDux';

export const dux = new BattleDux({
	initial: {
		coords: [0, 0],
		heading: 0,
		velocity: 0,
	},
	actions: {
		bogeyMovementResolution: (bogeyId, movement) => ({ bogeyId, movement }),
	},
	subduxes: {},
});

export default dux;

dux.setImmerMutation(
	'bogeyMovementResolution',
	(_draft, { movement }) => movement,
);

dux.setInflator((shorthand) => {
	return defaults(dux.initial, shorthand ?? {});
});
