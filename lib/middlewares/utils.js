"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mw_for = mw_for;

function mw_for(target, inner) {
    return store => next => action => {
        let func = next;

        if (action.type === target) {
            func = inner(store)(next);
        }

        return func(action);
    };
}