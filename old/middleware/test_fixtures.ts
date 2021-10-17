import fp from 'lodash/fp';
import { Middleware } from 'redux';

type MWFixtures = Partial<{
	dispatch: Function;
	getState: Function;
	next: Function;
	action: object;
}>;

function mw_fixtures(fixtures: MWFixtures) {
	return fp.defaults({
		dispatch: jest.fn(),
		getState: jest.fn(),
		next: jest.fn(),
		action: { type: 'NOOP' },
	})(fixtures);
}

export function test_mw(mw: Middleware, fixtures: MWFixtures = {}) {
	fixtures = mw_fixtures(fixtures);

	mw(fixtures as any)(fixtures.next as any)(fixtures.action);

	return fixtures;
}
