import u from 'updeep';
import R from 'remeda';
import { Updux } from 'updux';

export class BDux extends Updux {
	inflator = undefined;

	constructor(config) {
		super(config);
		this.inflator = config.inflator;
	}

	addSubactions(action, mw) {
		return this.addEffect(action, (api) => (next) => (action) => {
			next(action);

			const parentActionId = action.meta?.actionId;

			const localApi = this.augmentMiddlewareApi({
				...api,
				dispatch: (action) =>
					api.dispatch(u({ meta: { parentActionId } }, action)),
			});

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
