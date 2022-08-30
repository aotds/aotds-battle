import { BattleDux } from '~/BattleDux.js';

type ArmorState = {
	rating: number;
	current: number;
};

type ArmorStateShorthand = ArmorState | number;

export const dux = new BattleDux({
	initial: { rating: 0, current: 0 },
});

export default dux;

dux.setInflator((shorthand: ArmorStateShorthand) => {
	if (typeof shorthand === 'number')
		return {
			rating: shorthand,
			current: shorthand,
		};

	return shorthand;
});
