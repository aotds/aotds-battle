import u from 'updeep';
import R from 'remeda';
import { Updux } from 'updux';

export class BattleDux extends Updux {
	inflator = undefined;

	constructor(config) {
		super(config);
		this.inflator = config.inflator;
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

	setInflator(f) {
		this.inflator = f.bind(this);
	}

	subInflate(shorthand) {
		return u(
			R.mapValues(this.subduxes, (subdux) =>
				subdux.inflate ? subdux.inflate.bind(subdux) : (x) => x,
			),
			shorthand,
		);
	}

	inflate(shorthand) {
		if (this && this.inflator) return this.inflator(shorthand);

		return this.subInflate(shorthand);
	}
}
