
import Battle, { BattleState } from '../dux';
import bogey from '../dux/bogeys/bogey';
import fp from 'lodash/fp';

const debug = require('debug')('aotds:sample');

const { init_game, set_orders, play_turn } = Battle.actions;
const { getBogey } = Battle.selectors;

const { getFirecon } = bogey.selectors;

export const actions = [
    set_orders('enkidu', {
        firecons: { 1: { target_id: 'siduri' } },
        weapons: { 1: { firecon_id: 1 }, 2: { firecon_id: 1 }, 3: { firecon_id: 1 } },
    }),
    play_turn(),

];

export const tests = ( state: BattleState ) => t => {
    const { enkidu, siduri } = fp.keyBy('id', state.bogeys);

    expect(getFirecon(enkidu)(1)).toMatchObject({ id: 1, target_id: 'siduri' });
}
