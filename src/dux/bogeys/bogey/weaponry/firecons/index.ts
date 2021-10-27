import { BattleDux } from '../../../../../BattleDux';
import { Updux } from 'updux';

import { range } from 'lodash';

export const dux = new BattleDux({});

export default dux;

dux.setInflator((shorthand=0) => {
	if (typeof shorthand === 'object') return shorthand;

	return Object.fromEntries(
		range(1, shorthand + 1).map((id) => [
			id,
			{
				id,
			},
		]),
	);
});
