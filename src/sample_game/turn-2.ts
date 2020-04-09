import Battle, { BattleState } from '../dux';
import bogey from '../dux/bogeys/bogey';
import fp from 'lodash/fp';
import D from 'debug';

const debug = D('aotds:sample:t2');

const { init_game, set_orders, play_turn } = Battle.actions;
const { getBogey } = Battle.selectors;

const { getFirecon, getWeapon } = bogey.selectors;

export const actions = [
    set_orders('enkidu', {
        firecons: [{ firecon_id: 1, target_id: 'siduri' }],
        weapons: [
            { weapon_id: 1, firecon_id: 1 },
            { weapon_id: 2, firecon_id: 1 },
            { weapon_id: 3, firecon_id: 1 },
        ],
    }),
    play_turn(),
];

export const tests = (state: BattleState) => async t => {
    const { enkidu, siduri } = fp.keyBy('id', state.bogeys);

    t.match(getFirecon(enkidu)(1), { id: 1, target_id: 'siduri' }, 'enkidu is targeting siduri');

    const log = fp.flow([
        fp.findLast({ type: Battle.actions.play_turn.type }),
        ({ subactions }) => subactions,
        fp.find({ type: Battle.actions.weapon_orders_phase.type }),
        ({ subactions }) => subactions,
    ])(state.log);

    t.is(log.length, 3, 'weapon orders made it to the log');

    t.test('weapon assigned to firecon', async t => {
        const x = [1, 2, 3];
        x.forEach(i => {
            t.match(getWeapon(enkidu)(i), { firecon_id: 1 }, 'weapon assigned to firecon')
        })
    });
};
