'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = log_reducer;

var _actions = require('../actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const unwanted_actions = ['@@redux/INIT'];

function log_reducer(state = [], action) {
    if (unwanted_actions.some(a => action.type == a)) return state;

    switch (action.type) {
        case _actions2.default.PLAY_TURN:
            return [action];

        default:
            return state.concat(action);
    }
}