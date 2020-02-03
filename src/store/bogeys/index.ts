import _ from 'lodash';
import fp from 'lodash/fp';
import u from 'updeep';
import { oc } from 'ts-optchain';
import Redactor from '../../reducer/redactor';
import { init_game } from '../actions/phases';
import { BogeysState } from './types';
import { set_orders } from './bogey/actions';
import { bogey_reducer, bogey_upreducer } from './bogey/reducer';
import { bogey_movement, bogey_firecon_orders, bogey_weapon_orders, damage } from '../../actions/bogey';
import { Action } from '../../reducer/types';
import { BogeyState } from './bogey/types';
import Updux from 'updux';

import gameDux from '../game';
const { play_turn  } = gameDux.actions;

const updux = new Updux({
    initial: {} as { [bogey_id: string]: BogeyState },
    mutations: {
        '*': (payload:any,action:any) => u.map( bogey_upreducer(action) )
    },
});

updux.addMutation( init_game,
                  ({ bogeys }) => () => fp.keyBy('id',bogeys) );
updux.addMutation( play_turn,  () => fp.omitBy(
    'structure.destroyed'
));

function reduce_single_bogey(prop = 'id') {
    return (payload:any, action: Action) => u.updateIn(
        payload[prop], u.if( (x:unknown) => x, bogey_upreducer(action ) ) )
}

[ set_orders, bogey_movement, bogey_firecon_orders, bogey_weapon_orders, damage].forEach( action =>
    updux.addMutation( action, reduce_single_bogey('bogey_id') )
);

export default updux;
