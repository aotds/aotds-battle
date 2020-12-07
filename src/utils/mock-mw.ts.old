import fp from 'lodash/fp';

type MWFixtures = {
 api: {
    dispatch: any;
    getState: any;
 }
    next: any;
    action: any;
};

function mw_fixtures(fixtures: {}): MWFixtures {
    return fp.defaultsDeep({
        api: {
            dispatch: jest.fn(()=> {}),
            getState: jest.fn(() => ({})),
        },
        next: jest.fn(()=>{}),
        action: { type: 'NOOP' },
    }, fixtures) as MWFixtures;
}

export function mock_mw(mw: any, fixtures = {}) {
    const fix = mw_fixtures(fixtures);

    mw(fix.api)(fix.next as any)(fix.action);

    return fix;
}
