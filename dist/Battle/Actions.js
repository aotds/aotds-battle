'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.action_names = undefined;

var _actioner = require('../actioner');

var _actioner2 = _interopRequireDefault(_actioner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var actioner = new _actioner2.default();


actioner.add('init_game');

actioner.add('move_object');

actioner.add('play_move_object');

exports.default = actioner.combined();


//Object.keys( actions ).forEach( action => actioner.$add(action) );
// {
//     additionalProperties: false,
//     object: {
//         name: 'string',
//         objects: {
//             array: {}
//         },
//     },
// });

//export default actioner;
var action_names = exports.action_names = actioner.names();