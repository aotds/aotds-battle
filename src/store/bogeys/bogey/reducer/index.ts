// @format
import _ from 'lodash';
import u from 'updeep';
import { combineReducers } from 'redux';
import Redactor from '../../../../reducer/redactor';
import { orders_upreducer } from '../orders/reducer';
import { Action } from '../../../../reducer/types';
import { combineUpReducers } from '../../../../reducer/utils';

const redactor = new Redactor({});

export const bogey_reducer = redactor.asReducer;
export const bogey_upreducer = redactor.asUpReducer;
export default bogey_reducer;

const default_upreducer = combineUpReducers({
    orders: orders_upreducer,
});

redactor.for('*', default_upreducer);