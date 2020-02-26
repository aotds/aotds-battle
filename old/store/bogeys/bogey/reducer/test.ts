import reducer from './index';
import { bogey_movement } from '../../../../actions/bogey';

test('bogey_movement', () => {
    let result = reducer(
        {} as any,
        bogey_movement('foo', {
            coords: [1, 2],
        } as any),
    );

    expect(result).toHaveProperty('navigation.coords', [1,2] );
});
