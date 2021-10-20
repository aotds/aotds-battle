import { defaultsDeep } from 'lodash';

type MWFixtures = {
	api: {
		dispatch: any;
		getState: any;
	};
	next: any;
	action: any;
};

function mwFixtures(fixtures: Record<string, unknown>): MWFixtures {
	return defaultsDeep(fixtures, {
		api: {
			dispatch: jest.fn(() => {}),
			getState: jest.fn(() => ({})),
		},
		next: jest.fn(() => {}),
		action: { type: 'NOOP' },
	}) as MWFixtures;
}

export function mockMiddleware(mw: any, fixtures = {}) {
	const fix = mwFixtures(fixtures);

	mw(fix.api)(fix.next as any)(fix.action);

	return fix;
}
