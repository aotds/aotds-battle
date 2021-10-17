import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';
import { NavOrdersState } from '../../store/bogeys/bogey/orders/types';
import { BogeyState } from '../../store/bogeys/bogey/types';
import { NavigationState } from '../../store/bogeys/bogey/navigation/types';

import { oc } from 'ts-optchain';

type BogeyMovement = Pick<BogeyState, 'navigation' | 'drive' | 'orders'>;

// course
// trajectory

const roundCoords = (coords: [number, number]) =>
	coords.map((x) => _.round(x, 2));
