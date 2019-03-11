import {firecon_reducer} from './reducer';
import { bogey_execute_firecon_order } from './actions';

test( 'execute firecon order', () => {

    expect( firecon_reducer({} as any, bogey_execute_firecon_order("",1,{ target_id: 'enkidu' }) ) ).toHaveProperty( 'target_id', 'enkidu' );

    expect( firecon_reducer({ target_id: 'siduri'} as any, bogey_execute_firecon_order("",1,{ target_id: null }) ) ).not.toHaveProperty( 'target_id');
});
