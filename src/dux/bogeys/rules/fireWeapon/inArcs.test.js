import { test, expect } from 'vitest';

import { inArcs } from './inArcs.js';

test( "basic", () => {
    expect( inArcs(['F'],0) ).toBeTruthy();
});
