import tap from 'tap';
import dux from '.';
import { test_mw } from '../../utils/test_mw';
import fp from 'lodash/fp';

const mw = dux.middleware;
const ships = ['enkidu', 'siduri'];

const runMw = (args: {} | undefined) => test_mw(mw, args);

tap.test('weapon_firing_phase', async t => {
    const res = test_mw(mw as any, {
        action: dux.actions.weapon_firing_phase(),
        api: {
            getState: () => ships.map(id => ({ id })),
        },
    });

    t.match(fp.map('firstArg', res.api.dispatch.getCalls()), ships.map(dux.actions.bogey_fire), 'all ships fire');
});

tap.test('bogey_fire', async t => {
    t.test('ship does not exist', async t => {
        const res = runMw({
            action: dux.actions.bogey_fire('gilgamesh'),
            api: {
                getState: () => ships.map(id => ({ id })),
            },
        });

        t.ok(res.api.dispatch.notCalled, 'ship does not exist');
    });

    t.test('firecons with target fire', async t => {
        const res = runMw({
            action: dux.actions.bogey_fire('enkidu'),
            api: {
                getState: () => [
                    {
                        id: 'enkidu',
                        weaponry: {
                            firecons: [{ id: 1, target_id: 'a' }, { id: 2 }, { id: 3, target_id: 'b' }],
                        },
                    },
                ],
            },
        });

        t.match(
            fp.map('firstArg', res.api.dispatch.getCalls()),
            [
                dux.actions.firecon_fire({
                    bogey_id: 'enkidu',
                    firecon_id: 1,
                }),
                dux.actions.firecon_fire({
                    bogey_id: 'enkidu',
                    firecon_id: 3,
                }),
            ],
            'firecons with targets fire',
        );
    });
});

tap.test('firecon_fire', async t => {
    const {
        api: { dispatch },
    } = runMw({
        action: dux.actions.firecon_fire({
            bogey_id: 'enkidu',
            firecon_id: 1,
        }),
        api: {
            getState: () => [
                {
                    id: 'enkidu',
                    weaponry: {
                        firecons: [{ id: 1, target_id: 'a' }],
                        weapons: [{ id: 1 }, { id: 2, firecon_id: 1 }],
                    },
                },
            ],
        },
    });

    t.ok(
        dispatch.calledWithMatch(
            dux.actions.weapon_fire({
                bogey_id: 'enkidu',
                weapon_id: 2,
                target_id: 'a',
            }),
        ),
    );
});
