'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reduxActions = require('redux-actions');

var _actioner = require('../actioner');

var _actioner2 = _interopRequireDefault(_actioner);

var _schema = require('./schema');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actioner = new _actioner2.default({
    validate: function validate(action, schema) {
        return _schema.validate.call(action, '/action/' + action.type.toLowerCase());
    }
});

Object.keys(_schema.actions).forEach(function (action) {
    return actioner.$add(action);
});
// {
//     additionalProperties: false,
//     object: {
//         name: 'string',
//         objects: {
//             array: {}
//         },
//     },
// });

exports.default = actioner;