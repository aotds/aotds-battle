import {firecon_reducer} from './reducer';
import { bogey_firecon_orders } from '../../../../../actions/bogey';

test( 'execute firecon order', () => {

    expect( firecon_reducer({} as any, bogey_firecon_orders("",1,{ target_id: 'enkidu' }) ) ).toHaveProperty( 'target_id', 'enkidu' );

    expect( firecon_reducer({ target_id: 'siduri'} as any, bogey_firecon_orders("",1,{ target_id: null }) ) ).toHaveProperty( 'target_id', null);
});
