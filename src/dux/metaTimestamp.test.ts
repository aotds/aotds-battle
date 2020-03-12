import dux from './metaTimestamp';
import rootDux from '.';
import { test_mw } from '../utils/test_mw';

test('add a timestamp', () => {
    const result = test_mw(dux.middleware);

    expect(result.next).toHaveBeenCalled();

    expect(result.next.mock.calls[0][0].meta.timestamp).toMatch(/20\d{2}-\d{2}-\d{2}/);
});

test('add a timestamp, also applied to root dux', () => {
    const result = test_mw(rootDux.middleware);

    expect(result.next).toHaveBeenCalled();

    expect(result.next.mock.calls[0][0].meta.timestamp).toMatch(/20\d{2}-\d{2}-\d{2}/);
});
