import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['**/*test.js'],
		exclude: ['build/**', 'node_modules/**'],
	},
});
