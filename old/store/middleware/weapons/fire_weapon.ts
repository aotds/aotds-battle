import { fire_weapon } from '../../actions/phases';
import { mw_subactions_for } from '../../../middleware/subactions';
import { get_bogey } from '../../selectors';
import { fire_weapon_outcome } from '../../../actions/bogey';
import { fire_weapon as fire_weapon_rules } from '../../../rules/weapons';

export default mw_subactions_for(
	fire_weapon,
	({ getState, dispatch }) => (next) => (action) => {
		let attacker = get_bogey(getState(), action.payload.bogey_id);
		let target = get_bogey(getState(), action.payload.target_id);
		let weapon = attacker.weaponry!.weapons![action.payload.weapon_id];

		const debug = require('debug')('aotds:mw:weapons:fire_weapon');
		debug(action);

		const outcome = fire_weapon_outcome(
			action.payload.bogey_id,
			action.payload.target_id,
			fire_weapon_rules(attacker, target, weapon),
		);

		dispatch(outcome);
	},
);
