import dux, { inflate } from '.';
import { mock_mw } from '../../utils/mock-mw';

test('generates bogey_movement', () => {
    const res = mock_mw(dux.middleware, {
        action: dux.actions.movement_phase(),
        api: {
            getState() {
                return [{ id: 'a' }, { id: 'b' }];
            },
        },
    });

    expect(res.api.dispatch).toHaveBeenCalledTimes(2);

    expect(res.api.dispatch).toHaveBeenCalledWith(expect.objectContaining(dux.actions.bogey_movement('a')));
});

test('movement', () => {
    const res = mock_mw(dux.middleware, {
        action: dux.actions.bogey_movement('enkidu'),
        api: {
            getState() {
                return [
                    {
                        id: 'enkidu',
                        navigation: {
                            velocity: 0,
                        },
                    },
                ];
            },
        },
    });

    expect(res.api.dispatch).toHaveBeenCalled();
});

test('weapon_firing_phase', () => {
    const ships = ['enkidu', 'siduri'].map(id => ({ id }));

    const res = mock_mw(dux.middleware, {
        action: dux.actions.weapon_firing_phase(),
        api: {
            getState: () => ships,
        },
    });

    // all ships fire
    expect(res.api.dispatch).toHaveBeenCalledTimes(2);

    expect(res.api.dispatch).toHaveBeenCalledWith(expect.objectContaining(dux.actions.bogey_fire('enkidu')));
});

describe('bogey_fire', () => {
    test('ship does not exist', () => {
        const res = mock_mw(dux.middleware, {
            action: dux.actions.bogey_fire('gilgamesh'),
            api: {
                getState: () => ['enkidu'].map(id => ({ id })),
            },
        });

        expect(res.api.dispatch).not.toHaveBeenCalled();
    });

    test('firecons with target fire', () => {
        const res = mock_mw(dux.middleware, {
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

        expect(res.api.dispatch).toHaveBeenCalledWith(
            expect.objectContaining(
                dux.actions.firecon_fire({
                    bogey_id: 'enkidu',
                    firecon_id: 1,
                }),
            ),
        );
    });
});

test('firecon_fire', () => {
    const {
        api: { dispatch },
    } = mock_mw(dux.middleware, {
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

    expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining(
            dux.actions.weapon_fire({
                bogey_id: 'enkidu',
                weapon_id: 2,
                target_id: 'a',
            }),
        ),
    );
});

test('weapon_fire', () => {
    const {
        api: { dispatch },
    } = mock_mw(dux.middleware, {
        action: dux.actions.weapon_fire({
            bogey_id: 'enkidu',
            target_id: 'siduri',
            weapon_id: 1,
        }),
        api: {
            getState: () =>
                inflate([
                    {
                        id: 'enkidu',
                        navigation: {
                            coords: [0, 0],
                            heading: 3,
                        },
                        weaponry: {
                            weapons: [{ arcs: ['F'], weapon_type: 'beam', weapon_class: 1 }],
                        },
                    },
                    {
                        id: 'siduri',
                        navigation: {
                            coords: [10, 0],
                            heading: 0,
                        },
                    },
                ]),
        },
    });

    expect(dispatch).toHaveBeenCalled();

    expect(dispatch.mock.calls[0][0]).toMatchObject(
        dux.actions.weapon_fire_outcome({
            bogey_id: 'siduri',
            outcome: {
                distance: 10,
                bearing: 0,
            },
        }),
    );
});

test('weapon_fire_outcome', () => {
    const {
        api: { dispatch },
    } = mock_mw(dux.middleware, {
        action: dux.actions.weapon_fire_outcome({
            bogey_id: 'enkidu',
            outcome: {
                damage_dice: [6],
                penetrating_damage_dice: [6],
            },
        }),
        api: {
            getState: () =>
                inflate([
                    {
                        id: 'enkidu',
                        navigation: {
                            coords: [0, 0],
                            heading: 3,
                        },
                        weaponry: {
                            shields: [1, 2],
                        },
                    },
                ]),
        },
    });

    expect(dispatch).toHaveBeenCalled();

    expect(dispatch.mock.calls[0][0]).toMatchObject(
        dux.actions.bogey_damage({
            bogey_id: 'enkidu',
            damage: 2,
        }),
    );

    expect(dispatch.mock.calls[1][0]).toMatchObject(
        dux.actions.bogey_damage({
            bogey_id: 'enkidu',
            damage: 2,
            penetrating: true,
        }),
    );
});

test('bogey_damage', () => {
    const store = dux.createStore(
        inflate([
            {
                id: 'enkidu',
                structure: {
                    hull: 10,
                    armor: 10,
                },
            },
            {
                id: 'siduri',
                structure: {
                    hull: 10,
                    armor: 10,
                },
            },
        ]),
    );

    store.dispatch(
        dux.actions.bogey_damage({
            bogey_id: 'enkidu',
            damage: 3,
        }),
    );

    expect(dux.selectors.getBogey(store.getState())('enkidu')).toHaveProperty('structure.armor.current', 8);

    expect(dux.selectors.getBogey(store.getState())('enkidu')).toHaveProperty('structure.hull.current', 9);

    expect(dux.selectors.getBogey(store.getState())('siduri')).toHaveProperty('structure.armor.current', 10);
});
