'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapping_reducer = exports.init_reducer = undefined;
exports.actions_reducer = actions_reducer;
exports.combine_reducers = combine_reducers;
exports.pipe_reducers = pipe_reducers;

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

var _updeep = require('updeep');

var _updeep2 = _interopRequireDefault(_updeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function actions_reducer(redactions, initial_state = {}) {
    return function (state = initial_state, action) {
        let red = redactions[action.type] || redactions['*'];
        return red ? red(action)(state) : state;
    };
}

const debug = require('debug')('aotds:debug');

function combine_reducers(reducers) {
    // first let's get the recursivity out of the way
    reducers = _fp2.default.mapValues(red => {
        return _fp2.default.isObjectLike(red) ? combine_reducers(red) : red;
    })(reducers);

    return (state, action) => {
        let r = _fp2.default.mapValues(function (red) {
            return s => {
                return red(s, action);
            };
        })(reducers);
        return (0, _updeep2.default)(r)(state);
    };
}

function pipe_reducers(reducers) {

    return reducers.reduceRight((accum, reducer) => (state, action) => {
        return accum(reducer(state, action), action);
    });
}

const init_reducer = exports.init_reducer = original_state => state => _fp2.default.isNil(state) ? original_state : state;

// condition signature: action => state => boolean
// condition can be a boolean too
const mapping_reducer = exports.mapping_reducer = reducer => cond => action => _updeep2.default.map(_updeep2.default.if(typeof cond === 'function' ? cond(action) : cond, state => reducer(state, action)));