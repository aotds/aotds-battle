import fp from 'lodash/fp';
import { Action } from 'redux';
import { UpduxMiddleware } from 'updux/dist/types';

type MockFn = ReturnType<typeof jest.fn>;

type MWFixtures = {
    dispatch: MockFn;
    getState: MockFn;
    next: MockFn;
    action: Action<string>;
};

function mw_fixtures(fixtures: Partial<MWFixtures>) {
    return fp.defaults({
        dispatch: jest.fn(),
        getState: jest.fn(),
        next: jest.fn(),
        action: { type: 'NOOP' },
    })(fixtures) as MWFixtures;
}

export function test_mw(mw: UpduxMiddleware, fixtures: Partial<MWFixtures> = {}) {
    const fix = mw_fixtures(fixtures);

    mw(fix as any)(fix.next as any)(fix.action);

    return fix;
}
