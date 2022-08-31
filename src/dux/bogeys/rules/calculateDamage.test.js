import { test, expect } from 'vitest';

import { calculateDamage } from './calculateDamage.js';

test('basic', async () => {
	expect(calculateDamage(0, [5])).toEqual(1);
});
