'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.actionsHandler = actionsHandler;
function actionsHandler(actions) {
    var default_state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return function () {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : default_state;
        var action = arguments[1];

        var reducer = actions[action.type] || actions['*'];

        return reducer ? reducer(state, action) : state;
    };
}