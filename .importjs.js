module.exports = {
    excludes: [ './lib/**' ],
    aliases: {
        '_': 'node_modules/lodash',
        'fp': 'node_modules/lodash/fp',
        'u': 'node_modules/updeep',
    },
    namedExports: {
        'redux-saga/effects': [
            'put',
            'select',
            'takeEvery'
        ],
    }
};
