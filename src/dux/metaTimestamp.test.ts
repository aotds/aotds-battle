import dux from './metaTimestamp';
import rootDux from '.';
import { test_mw } from '../utils/test_mw';
import { test } from 'tap';

test('add a timestamp', t => {
    const result = test_mw(dux.middleware);

    t.match(result.next.firstCall.args[0].meta.timestamp, /20\d{2}-\d{2}-\d{2}/);

    t.end();
});

test('add a timestamp, also applied to root dux', t => {
    const result = test_mw(rootDux.middleware);

    t.match(result.next.firstCall.args[0].meta.timestamp, /20\d{2}-\d{2}-\d{2}/);

    t.end();
});
