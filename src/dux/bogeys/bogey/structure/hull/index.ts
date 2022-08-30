import { BattleDux } from '~/BattleDux.js';

type HullState = {
	rating: number;
	current: number;
};

type HullStateShorthand = HullState | number;

export const dux = new BattleDux({
	initial: { rating: 0, current: 0 },
});

export default dux;

dux.setInflator((shorthand: HullStateShorthand) => {
	if (typeof shorthand === 'number')
		return {
			rating: shorthand,
			current: shorthand,
		};

	return shorthand;
});
