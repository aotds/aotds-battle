import { Updux } from 'updux';
import u from 'updeep';

type LogEntry = {
	meta: {
		actionId: number;
		parentActionId?: number;
	};
};

export function orderedLog(log: LogEntry[]) {
	let ordered = [...log];

	ordered.reverse();

	const subactions = {};

	ordered = ordered
		.map((entry) => {
			if (subactions[entry.meta.actionId]) {
				entry = u(
					{ subactions: subactions[entry.meta.actionId] },
					entry,
				) as LogEntry;
				delete subactions[entry.meta.actionId];
			}

			if (!entry.meta.parentActionId) return entry;

			if (!subactions[entry.meta.parentActionId])
				subactions[entry.meta.parentActionId] = [];

			subactions[entry.meta.parentActionId].unshift(entry);

			return [];
		})
		.flat();

	ordered.reverse();

	return ordered;
}

export const dux = new Updux({
	initial: [],
	selectors: {
		orderedLog,
	},
	mutations: {
		'+': (_payload, action) => (log: any) => {
			// can't be caught by the middleware
			if (/@@/.test(action.type)) return log;

			if (action?.meta?.noLog) return log;

			return [...log, action];
		},
	},
});
