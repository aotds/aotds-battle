// @format

import { action } from '.';
import { NavigationState } from '../store/bogeys/bogey/navigation/types';

export const bogey_movement = action('BOGEY_MOVEMENT', (id: string, navigation: NavigationState) => ({
    id,
    navigation,
}));
