import reducer from './reducer';
import { set_orders } from './bogey/actions';
import { BogeysState } from './types';

test( 'set_orders', () => {
    let state: BogeysState = {
        enkidu: { },
        siduri: { },
    };

    state = reducer( state, set_orders( 'enkidu', { navigation: { thrust: 2 } } ) );

    expect(state).toHaveProperty('enkidu.orders.navigation.thrust', 2);
    expect(state).not.toHaveProperty('siduri.orders.navigation.thrust');
})
