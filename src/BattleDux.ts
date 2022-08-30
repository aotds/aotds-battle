import { produce } from 'immer';
import  identity from 'lodash/identity.js';
import mapValues  from 'lodash/fp/mapValues.js';
import u from 'updeep';
import {
	AggregateDuxActions,
	AggregateDuxState,
	Updux,
	UpduxConfig,
} from 'updux';

type ImmerMutation<
	TState,
	TAction extends {
		payload: any;
	}
> = (
	state: TState,
	payload: TAction['payload'],
	action: TAction,
) => void | TState;

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

	addSubEffect(action, mw) {
		return this.addEffect(action, (api) => (next) => (action) => {
			if (action.meta?.noLog) return next(action);
			//		if (!action.meta?.actionId) return next(action);

			const parentActionId = action.meta?.actionId;

			const localApi = this.augmentMiddlewareApi({
				...api,
				dispatch: (action) =>
					api.dispatch(u({ meta: { parentActionId } }, action)),
			});

			next(action);

			mw(localApi)(action);
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
		if (this && this.inflator) return this.inflator(shorthand);

		return this && this.subInflate(shorthand);
	}

	setImmerMutation<
		TAction extends keyof AggregateDuxActions<TActions, TSubduxes>
	>(
		actionType: TAction,
		mutation: ImmerMutation<
			AggregateDuxState<TState, TSubduxes>,
			ReturnType<AggregateDuxActions<TActions, TSubduxes>[TAction]>
		>,
	) {
		const producer = produce(mutation);
		return this.setMutation(actionType, (payload, action) => (state) =>
			producer(state as any, payload, action) as any,
		) as any;
	}
}
