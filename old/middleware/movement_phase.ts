import { bogey_movement } from '../actions/bogey';
import { plot_movement } from '../rules/movement';
import { get_bogeys, get_bogey } from '../store/selectors';
import { BogeyState } from '../store/bogeys/bogey/types';
import { movement_phase } from '../store/actions/phases';
import fp from 'lodash/fp';
import { mw_for } from './utils';
import { mw_subactions_for } from './subactions';

const debug = require('debug')('aotds:saga:mp');

const move_bogeys = ({ getState, dispatch }: any) => () => () => {
	let ship_ids = get_bogeys(getState()).map(({ id }) => id);

	for (const id of ship_ids) {
		dispatch(bogey_movement(id, plot_movement(get_bogey(getState(), id))));
	}
};

export const mw_movement_phase = mw_subactions_for(movement_phase, move_bogeys);

export default mw_movement_phase;
