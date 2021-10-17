// @format

import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';

import Redactor from '../../../../reducer/redactor';
import { damage } from '../actions';
import { StructureState } from './types';
import { internal_damage } from '../../../../actions/bogey';

const redactor = new Redactor({} as StructureState);
export const structure_reducer = redactor.asReducer;
export const structure_upreducer = redactor.asUpReducer;

redactor.for(internal_damage, ({ payload: { system } }) => (struct) => {
	if (system.type === 'shield') {
		return u.updateIn(`shields.${system.id}.damaged`, true, struct);
	}

	return struct;
});

redactor.for(damage, ({ payload: { damage, is_penetrating } }) => (state) => {
	if (!damage) return state;

	let armor = _.get(state, ['armor', 'current'], 0);

	let update: Partial<Record<'hull' | 'armor', object>> = {};

	const dec_current = (damage: number) => ({
		current: (v: number) => v - damage,
	});

	if (armor && !is_penetrating) {
		const armor_damage = fp.min([fp.ceil(damage / 2), armor]);
		damage -= armor_damage;
		update.armor = dec_current(armor_damage);
	}

	update.hull = dec_current(damage);

	return u.if((s: any) => _.get(s, 'hull.current', 0) <= 0, {
		destroyed: true,
	})(u(update, state));
});
