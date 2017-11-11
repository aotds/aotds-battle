'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _callee;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _effects = require('redux-saga/effects');

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _movement = require('./movement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [play_move_object, _callee].map(regeneratorRuntime.mark);

var get_object = function get_object(id) {
    return function (state) {
        return _lodash2.default.find(state.objects, { id: id });
    };
};

function play_move_object(action) {
    var object_id, obj, navigation;
    return regeneratorRuntime.wrap(function play_move_object$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    object_id = action.payload.object_id;
                    _context.next = 3;
                    return (0, _effects.select)(get_object(object_id));

                case 3:
                    obj = _context.sent;
                    navigation = (0, _movement.gen_object_movement)(obj, action.payload);
                    _context.next = 7;
                    return (0, _effects.put)({ type: 'MOVE_OBJECT', payload: {
                            object_id: object_id,
                            navigation: navigation
                        } });

                case 7:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked[0], this);
}

function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return (0, _effects.takeEvery)(_Actions2.default.PLAY_MOVE_OBJECT, play_move_object);

                case 2:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _marked[1], this);
}