import _ from 'lodash';
import u from 'updeep';
import { combineUpReducers } from './utils';

test( 'combineUpReducers', () => {

    const up = combineUpReducers({
        foo: (a:number) => (state:number) => state + a,
        bar: {
            baz: (a:number) => (state:number) => state / a
        }
    });

    expect( up(2 as any)({ foo: 1, bar: { baz: 8 } }) ).toEqual({
        foo: 3,
        bar: { baz: 4 } });


});


