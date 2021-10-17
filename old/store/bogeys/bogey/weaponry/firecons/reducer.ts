import _ from 'lodash';
import u from 'updeep';
import Redactor from '../../../../../reducer/redactor';
import { bogey_firecon_orders } from '../../../../../actions/bogey';
import { firecon_upreducer } from '../firecon/reducer';
import { FireconState } from '../firecon/types';

const redactor = new Redactor(
	[] as FireconState[],
	undefined,
	'aotds:reducer:bogeys:bogey:weaponry:firecons',
);

export const firecons_reducer = redactor.asReducer;
export const firecons_upreducer = redactor.asUpReducer;

redactor.for('*', (action) => u.map(firecon_upreducer(action)));

redactor.addRedaction(bogey_firecon_orders, (action) =>
	u({
		[action.payload.firecon_id]: u.if(
			_.identity,
			firecon_upreducer(action),
		),
	}),
);
