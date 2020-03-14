import fp from 'lodash/fp';
import { Action } from 'redux';
import { UpduxMiddleware } from 'updux/dist/types';
import sinon from 'sinon';

type MockFn = ReturnType<typeof sinon.spy>;

type MWFixtures = {
    dispatch: MockFn;
    getState: MockFn;
    next: MockFn;
    action: Action<string>;
};

function mw_fixtures(fixtures: Partial<MWFixtures>) {
    return fp.defaults({
        dispatch: sinon.spy(),
        getState: sinon.spy(),
        next: sinon.spy(),
        action: { type: 'NOOP' },
    })(fixtures) as MWFixtures;
}

export function test_mw(mw: UpduxMiddleware, fixtures: Partial<MWFixtures> = {}) {
    const fix = mw_fixtures(fixtures);

    mw(fix as any)(fix.next as any)(fix.action);

    return fix;
}
