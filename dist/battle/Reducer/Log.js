'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = LogReducer;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function LogReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var action = arguments[1];


    switch (action.type) {
        case '@@redux/INIT':
            return state;

        default:
            return [].concat(_toConsumableArray(state), [action]);
    }
}