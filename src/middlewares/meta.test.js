import _ from 'lodash';

import { add_timestamp, add_action_id } from './meta';

import { inc_action_id } from '~/actions';

test( 'timestamp', () => {

    let now = 1234;
    Date.now = jest.fn();
    Date.now.mockReturnValue(now);

    let result = add_timestamp(null,x => x,{});

    expect(result).toHaveProperty( 'meta.timestamp' );
    expect(result.meta.timestamp).toBeGreaterThan(0);
    expect(result.meta.timestamp).toBe(now);

});


test( 'add_action_id', () => {
    let getStore = () => ({ game: { next_action_id: 123 } });
    let dispatch = jest.fn();

    let result = add_action_id({getStore,dispatch},x=>x,{});

    expect(result).toHaveProperty('meta.id', 123);

    expect(dispatch).toHaveBeenCalledWith( inc_action_id() );


});
