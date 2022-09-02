import { Updux } from 'updux';
import u from 'updeep';

// type LogEntry = {
// 	meta: {
// 		actionId: number;
// 		parentActionId?: number;
// 	};
// };

export function groupedLog(log) {
	let grouped = [...log];

	grouped.reverse();

	const subactionsCache = {};

	grouped = grouped
		.map((entry) => {
			const subactions = subactionsCache[entry.meta.actionId];
			entry = u({ subactions }, entry);
			delete subactionsCache[entry.meta.actionId];

			// it's a root entry, we keep it
			if (!entry.meta.parentActionId) return entry;

			subactionsCache[entry.meta.parentActionId] ??= [];
			subactionsCache[entry.meta.parentActionId].unshift(entry);

			return [];
		})
		.flat();

	grouped.reverse();

	return grouped;
}

export const dux = new Updux({
	initial: [],
	selectors: {
		groupedLog,
	},
	mutations: {
		'*': (_payload, action) => (log) => {
			// can't be caught by the middleware
			if (action.type.includes('@@')) return log;

			if (action?.meta?.noLog) return log;

			return [...log, action];
		},
	},
});
