import { BattleDux } from '../../../../../BattleDux';
import { Updux } from 'updux';

export const dux = new BattleDux({});

export default dux;

dux.setInflator((shorthand) => {
	if (!Array.isArray(shorthand)) return shorthand;

	return Object.fromEntries(
		shorthand.map((obj = {}, id) => [id + 1, { ...obj, id: id + 1 }]),
	);
});
