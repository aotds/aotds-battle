import fp from 'lodash/fp';
import u from 'updeep';
import { Action } from 'redux';
import { UpduxMiddleware } from 'updux/dist/types';
import sinon from 'sinon';

type MockFn = ReturnType<typeof sinon.spy>;

type MWFixtures = {
 api: {
    dispatch: MockFn;
    getState: MockFn;
 }
    next: MockFn;
    action: Action<string>;
};

function mw_fixtures(fixtures: any): MWFixtures {
    return fp.defaultsDeep({
        api: {
            dispatch: sinon.spy(()=> {}),
            getState: sinon.spy(() => ({})),
        },
        next: sinon.spy(()=>{}),
        action: { type: 'NOOP' },
    }, fixtures) as MWFixtures;
}

export function test_mw(mw: any, fixtures  = {}) {
    const fix = mw_fixtures(fixtures);

    mw(fix.api as any)(fix.next as any)(fix.action as any);

    return fix;
}
