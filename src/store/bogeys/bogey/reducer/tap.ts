// @format
/// <reference types="../../../../tap" />
import t from 'tap';

import reducer from './index';
import { bogey_movement } from '../../../../actions/bogey';

t.test('bogey_movement', async (t: any) => {
    let result = reducer(
        {} as any,
        bogey_movement('foo', {
            coords: [1, 2],
        } as any),
    );

    t.same(result.navigation.coords, [1, 2]);
});
