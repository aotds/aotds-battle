import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import Battle from '../battle/index';
import initial_state from './initial_state';
import { init_game, try_play_turn, play_turn, weapons_firing_phase, fire_weapon } from '../store/actions/phases';
import { Action, ActionCreator } from '../reducer/types';
import { set_orders } from '../store/bogeys/bogey/actions';
import { LogState, LogAction } from '../store/log/reducer/types';
import { get_bogey } from '../store/selectors';
import { isType, guard } from 'ts-action';
import { fire_weapon_outcome, damage } from '../actions/bogey';
import { BattleState } from '../store/types';
import { writeFileSync } from 'fs';

const debug = require('debug')('aotds:sample:t2');

export const actions = [
    set_orders('enkidu', {
        firecons: { 0: { target_id: 'siduri' } },
        weapons: { 0: { firecon_id: 0 }, 1: { firecon_id: 0 }, 2: { firecon_id: 0 } },
    }),
    play_turn(),
];

export const dice = [[6, 5], [3], [1], [1], [90]]; //[[6, 5], [3], [1], [1], [90]];

const findLog = (log: LogState, { type }: Action) => {
    expect(log).toEqual(expect.arrayContaining([expect.objectContaining({ type })]));
    return log.filter(l => l.type === type);
};

const flattenSubactions = (log: LogState) =>
    log.reduce((accum, { subactions }) => (subactions ? [...accum, ...subactions] : accum), [] as LogState);

function pretty_print_log(log: LogState = []): any {
    return log.map(l => ({ [l.type]: [(l as any).payload, pretty_print_log(l.subactions)] }));
}

const debugSave = (log: any) => writeFileSync('./debug.json', JSON.stringify(pretty_print_log(log), undefined, 2));

export const tests = (state: BattleState) => {

    debug(pretty_print_log(state.log));
    debugSave(state.log);

    const enkidu = get_bogey(state, 'enkidu');
    const siduri = get_bogey(state, 'siduri');

    expect((enkidu.weaponry as any).weapons[1]).toHaveProperty('firecon_id', 0);
    expect(siduri).not.toHaveProperty('weaponry.weapons.0');

    // writeFileSync('./battle.json', JSON.stringify(log, undefined, 2));

    const [this_turn, ...orphans]: any[] = state.log.splice(_.findLastIndex(state.log, { type: play_turn.type }));

    expect(orphans).toHaveLength(0);
    debug(this_turn);

    const firing_phase = this_turn.subactions.find(guard(weapons_firing_phase));
    expect(firing_phase).toBeTruthy();

    // shoots fired!
    const firing = firing_phase.subactions;

    let logs = findLog(firing, fire_weapon);
    logs = findLog(logs[0].subactions!, fire_weapon_outcome);

    expect(logs).toHaveLength(1);

    logs = findLog(flattenSubactions(logs), damage);

    // we haz shields?
    expect(siduri.structure.shields).toMatchObject([{ id: 0, level: 1 }, { id: 1, level: 2 }]);

    // the shields should absorb some of the damage
    expect(_.filter(logs, damage('siduri', 2))).not.toHaveLength(0);

    // and we have some internal damage too
    debug(logs);
    findLog(flattenSubactions(logs), { type: 'INTERNAL_DAMAGE' });

    expect(siduri).toMatchObject({
        structure: {
            hull: { current: 3, rating: 4 },
            armor: { current: 3, rating: 4 },
        },
        drive: {
            current: 3,
            damage_level: 1,
            rating: 6,
        },
    });

    // only siduri gets damage
    expect(state.bogeys.enkidu.structure).toMatchObject({
        hull: { current: 4 },
        armor: { current: 4 },
    });
};
