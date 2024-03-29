module.exports = {
	presets: [
		['@babel/preset-env', { targets: { node: 'current' } }],
		'@babel/preset-typescript',
	],
	plugins: [
		'transform-class-properties',
		[
			'module-resolver',
			{
				root: ['./src'],
				alias: {
					'~': './src',
				},
			},
		],
	],
};
