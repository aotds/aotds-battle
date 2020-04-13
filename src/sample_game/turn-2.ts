import Battle, { BattleState } from '../dux';
import bogey from '../dux/bogeys/bogey';
import fp from 'lodash/fp';
import D from 'debug';

const debug = D('aotds:sample:t2');

const { init_game, set_orders, play_turn } = Battle.actions;
const { getBogey } = Battle.selectors;

const { getFirecon, getWeapon } = bogey.selectors;

export const dice = [
    [6, 5], [3], [1], [1], [90]
].map( r => [ r ] );

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

function findAction(log: any, {type}: {type: string}): any {
    return log.map(
        (action) => [
            action.type === type ? action : [],
            action.subactions ? findAction(action.subactions,{type}) : []
        ]
    ).flat(Infinity);
}

const lastTurn = log =>fp.last(findAction(log,Battle.actions.play_turn))

export const tests = (state: BattleState) => async t => {
    const { enkidu, siduri } = fp.keyBy('id', state.bogeys);

    // console.log("waiting");

    // const p = new Promise( resolve => setTimeout(resolve,1000000));
    // await p;

    const [log] = findAction( [lastTurn(state.log)], Battle.actions.weapon_orders_phase);

    t.is(log.subactions.length, 3, 'weapon orders made it to the log');

    t.test('weapon assigned to firecon', async t => {
        const x = [1, 2, 3];
        x.forEach(i => {
            t.match(getWeapon(enkidu)(i), { firecon_id: 1 }, 'weapon assigned to firecon')
        })
    });
};
