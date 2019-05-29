// @format

import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';
import { oc } from 'ts-optchain';
import Redactor from '../../reducer/redactor';
import { init_game, play_turn } from '../actions/phases';
import { BogeysState } from './types';
import { set_orders } from './bogey/actions';
import { bogey_reducer, bogey_upreducer } from './bogey/reducer';
import { bogey_movement, bogey_firecon_orders, bogey_weapon_orders, damage } from '../../actions/bogey';
import { Action } from '../../reducer/types';
import { BogeyState } from './bogey/types';

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
redactor.for(bogey_weapon_orders, reduce_single_bogey('bogey_id'));
redactor.for(damage, reduce_single_bogey('bogey_id'));

redactor.for(play_turn, () => fp.omitBy(
    fp.get('structure.destroyed')
));

export default redactor.asReducer;
