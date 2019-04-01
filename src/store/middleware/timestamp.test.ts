import { timestamp } from './timestamp';
import { test_mw } from '../../middleware/test_fixtures';

test( 'add a timestamp', () => {
    const { next } = test_mw(timestamp);

    expect((next as any).mock.calls[0][0]).toHaveProperty('meta.timestamp');
});
