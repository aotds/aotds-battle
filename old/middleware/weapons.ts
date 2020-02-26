import { fire_weapon, weapons_firing_phase } from "../store/actions/phases";
import { action } from "../actions";
import { get_bogey } from "../store/selectors";
import * as rules from '../rules/weapons';
import { fire_weapon_outcome, damage, internal_damage, InternalDamage } from "../actions/bogey";
import { Action } from "../reducer/types";
import { isType } from "ts-action";
import { BattleState } from "../store/types";

import fp from 'lodash/fp';
import _ from 'lodash';
import u from 'updeep';
import dice from '../dice';
import { oc } from 'ts-optchain';
import { BogeyState } from "../store/bogeys/bogey/types";
import { mw_for, mw_compose } from './utils';
import weapons_firing_phase_mw from './weapons_firing_phase';

export default mw_compose([
    weapons_firing_phase_mw,
]);
