// @format

import _ from 'lodash';
import u from 'updeep';
import Redactor from '../../reducer/redactor';
import { init_game } from '../actions/phases';
import { BogeysState } from './types';
import { set_orders } from './bogey/actions';
import bogey_reducer, { bogey_upreducer } from './bogey/reducer';

const redactor = new Redactor({} as BogeysState);

redactor.for(init_game, ({ payload: { bogeys } }) => state => _.keyBy(bogeys, 'id'));

redactor.for(set_orders, action => u.updateIn(action.payload.bogey_id, bogey_upreducer(action)));

redactor.for('*', action => u.map(bogey_upreducer(action)));

export default redactor.asReducer;
