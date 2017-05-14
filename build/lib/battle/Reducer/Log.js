"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function LogReducer(state, action) {
    if (state === void 0) { state = []; }
    switch (action.type) {
        case '@@redux/INIT': return state;
        default: return state.concat([action]);
    }
}
exports.default = LogReducer;
