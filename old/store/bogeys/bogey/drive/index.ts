import Updux from 'updux';
import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import { produce } from 'immer';

import { DriveState } from './types';
import { internal_damage } from './internalDamage';

export { default as inflate } from './inflate';

const updux = new Updux<DriveState>();

const uu = (transform) => (state) => transform(state)(state);

updux.addMutation(internal_damage, ({ system, hit }) => (drive) => {
	if (system !== 'drive') return drive;
	if (!hit) return drive;

	drive = u(
		{ damage_level: fp.flow([fp.defaultTo(0), fp.add(1), fp.clamp(0, 2)]) },
		drive,
	);

	// if we are here it's a least a level of 1
	drive = uu(({ damage_level, rating }) =>
		u({ current: damage_level === 2 ? 0 : Math.floor(rating / 2) }),
	)(drive);

	return drive;
});

export default updux;
