import u from 'updeep';
import fp from 'lodash/fp';

import actions from '~/actions';

import { 
    redactor,
    mapping_reducer,
    actions_reducer, combine_reducers, pipe_reducers, init_reducer } from '../../utils';

const redact = redactor();

redact.EXECUTE_FIRECON_ORDERS = action => 
    u( f => ({ id: f.id, ...action.orders}) );

export default actions_reducer(redact);
