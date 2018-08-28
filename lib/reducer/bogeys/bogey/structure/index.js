"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redact = undefined;

var _updeep = require("updeep");

var _updeep2 = _interopRequireDefault(_updeep);

var _fp = require("lodash/fp");

var _fp2 = _interopRequireDefault(_fp);

var _utils = require("../../../utils");

var _actions = require("../../../../actions");

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:reducer:struct');

let redact = exports.redact = {};

redact.DAMAGE = ({
  damage,
  penetrating
}) => state => {
  if (!damage) return state;
  debug(state);
  let update;

  if (penetrating) {
    update = (0, _updeep2.default)({
      hull: {
        current: c => c - damage
      }
    });
  } else {
    let armor_damage = _fp2.default.min([_fp2.default.ceil(damage / 2), state.armor.current]);

    update = (0, _updeep2.default)({
      hull: {
        current: c => c - damage + armor_damage
      },
      armor: {
        current: c => c - armor_damage
      }
    });
  }

  let destroy = _updeep2.default.if(s => _fp2.default.getOr(1)('hull.current')(s) <= 0, {
    destroyed: true
  });

  return destroy(update(state));
};

function state_watch(dependencies, target, transform) {
  let previous_watched = undefined;

  if (typeof dependencies === 'string') {
    dependencies = _fp2.default.get(dependencies);
  }

  let watched = dependencies;

  if (Array.isArray(dependencies)) {
    watched = state => dependencies.map(d => _fp2.default.get(d)(state));
  }

  return reducer => (state, action) => {
    let new_state = reducer(state, action);
    let new_watched = watched(new_state);

    if (_fp2.default.isEqual(previous_watched, new_watched)) {
      return new_state;
    }

    let p = previous_watched;
    previous_watched = new_watched;
    return _updeep2.default.updateIn(target, transform(new_watched, _fp2.default.get(target)(new_state)))(new_state);
  };
} // const reducer = state_watch( [ 'hull.current' ] , 
//     'status', ([hull]) => { return ( hull <= 0 ) ? 'destroyed' : 'nominal' } ) (
//     actions_reducer( redact, { hull: 0, armor: 0, status: 'nominal' } )
// );


const reducer = (0, _utils.actions_reducer)(redact, {
  hull: 0,
  armor: 0,
  status: 'nominal'
});
exports.default = reducer;