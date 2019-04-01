import { clear_orders } from "../../../actions/phases";
import { orders_reducer } from "./reducer";

test( 'clear_orders', () => {

    expect( orders_reducer( { navigation: 'stuff' } as any, clear_orders() ) ).toEqual( {} );

})
