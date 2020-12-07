import dux from '.';
import { mock_mw } from '../utils/mock-mw';

test('add a timestamp', () => {
    const result = mock_mw(dux.middleware);

    expect(result.next.mock.calls[0][0]).toHaveProperty('meta.timestamp');

    expect(result.next.mock.calls[0][0].meta.timestamp).toMatch(
        /20\d{2}-\d{2}-\d{2}/);
});
