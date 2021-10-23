import { BattleDux } from '../../../../../BattleDux';
import { Updux } from 'updux';

export const dux = new BattleDux({});

export default dux;

dux.setInflator((shorthand) => {
	if (!Array.isArray(shorthand)) return shorthand;

	return Object.fromEntries(
		shorthand.map((level, id) => [
			id + 1,
			{ id: id + 1, level, damaged: false },
		]),
	);
});
