import { BattleDux } from '../../../../BattleDux';

const schema = {
	type: 'object',
	properties: {
		rating: { type: 'number', default: 0 },
		current: { type: 'number', default: 0 },
	},
};

export const dux = new BattleDux({
	initial: { rating: 0, current: 0 },
	schema,
});

export default dux;

dux.setInflator((shorthand) => {
	if (typeof shorthand === 'number')
		return {
			rating: shorthand,
			current: shorthand,
		};

	return shorthand;
});
