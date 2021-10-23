import u from 'updeep';
import { Updux, UpduxConfig } from 'updux';

import { identity, map, pickBy, filter, mapValues } from 'lodash/fp';

export class BattleDux<
	TState extends any = any,
	TActions extends Record<string, any> = any,
	TSelectors = any,
	TSubduxes extends Record<string, any> = any
> extends Updux<TState, TActions, TSelectors, TSubduxes> {
	inflator: ((...args: any) => any) | undefined = undefined;

	constructor(config: UpduxConfig<TState, TActions, TSelectors, TSubduxes>) {
		super(config);
	}

	subactionFor(action, mw) {
		return this.addEffect(action, (api) => (next) => (action) => {
			if (action.meta?.noLog) return next(action);
			if (!action.meta?.actionId) return next(action);

			const parentActionId = action.meta?.actionId;

			const localApi = this.augmentMiddlewareApi({
				...api,
				dispatch: (action) =>
					api.dispatch(u({ meta: { parentActionId } }, action)),
			});

			next(action);

			mw(localApi)(next)(api);
		});
	}

	setInflator(f: (...args: any) => any) {
		this.inflator = f.bind(this);
	}

	subInflate(shorthand) {
		return u(
			mapValues(
				(subdux: any) =>
					subdux.inflate ? subdux.inflate.bind(subdux) : identity,
				this.subduxes,
			),
			shorthand,
		);
	}

	inflate(shorthand: any) {
		if (this.inflator) return this.inflator(shorthand);

		return this.subInflate(shorthand);
	}
}
