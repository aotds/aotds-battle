import Updux from 'updux';
import u from 'updeep';

import { OrdersState } from "./types";
import { set_orders, clear_orders } from "../actions";

const dux = new Updux();

dux.addMutation(
    set_orders, ({orders}) => () => ({...orders,done: true})
)

dux.addMutation(
    clear_orders, () => () => ({})
)

dux.addEffect(
    set_orders, () => next => action => {
        next( u.updateIn('payload.done', done => done || (new Date()).toISOString() ) )
    }
)


export default dux;


