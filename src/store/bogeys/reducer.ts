// @format

import _ from 'lodash';
import u from 'updeep';
import Redactor from '../../reducer/redactor';
import { init_game } from '../actions/phases';
import { BogeysState } from './types';
import { set_orders } from './bogey/actions';
import { bogey_reducer, bogey_upreducer } from './bogey/reducer';
import { bogey_movement, bogey_firecon_orders } from '../../actions/bogey';
import { Action } from '../../reducer/types';

const redactor = new Redactor({} as BogeysState, undefined, 'aotds:reducer:bogeys');

redactor.for(init_game, ({ payload: { bogeys } }) => state => _.keyBy(bogeys, 'id'));

redactor.for(set_orders, action => u.updateIn(action.payload.bogey_id, bogey_upreducer(action)));

redactor.for('*', action => u.map(bogey_upreducer(action)));

function reduce_single_bogey(prop = 'id') {
    return (action: Action) => {
        return u({
            [_.get(action, ['payload', prop])]: u.if(_.identity, bogey_upreducer(action)),
        });
    };
}

redactor.for(bogey_movement, reduce_single_bogey());
redactor.for(bogey_firecon_orders, reduce_single_bogey('bogey_id'));

export default redactor.asReducer;
