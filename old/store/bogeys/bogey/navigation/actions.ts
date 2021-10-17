import { NavigationState } from './types';
import { action } from '../../../../actions';

export const move_bogey = action(
	'MOVE_BOGEY',
	(bogey_id: string, navigation: NavigationState) => ({
		bogey_id,
		navigation,
	}),
);
