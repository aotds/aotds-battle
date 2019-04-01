import reducer from './reducer';
import { set_orders } from './bogey/actions';
import { BogeysState } from './types';
import { clear_orders } from '../actions/phases';

test( 'set_orders', () => {
    let state: BogeysState = {
        enkidu: { },
        siduri: { },
    };

    state = reducer( state, set_orders( 'enkidu', { navigation: { thrust: 2 } } ) );

    expect(state).toHaveProperty('enkidu.orders.navigation.thrust', 2);
    expect(state).not.toHaveProperty('siduri.orders.navigation.thrust');
})

test( 'clear_orders trigger bogey_reducer', () => {
    let state = reducer( { enkidu: { orders: { navigation: {} } } }, clear_orders() );

    expect(state).not.toHaveProperty('enkidu.orders.navigation');

});
