import { test, expect } from 'vitest';

import dux from './armor.js';

test( "basic", async () => {
    expect( dux.inflate(4) ).toEqual({ rating: 4, current: 4 });
});
