"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _meta = require("./meta");

var _validate_schema = require("./validate_schema");

var _validate_schema2 = _interopRequireDefault(_validate_schema);

var _play_turn = require("./play_turn");

var _play_turn2 = _interopRequireDefault(_play_turn);

var _weapons = require("./weapons");

var _weapons2 = _interopRequireDefault(_weapons);

var _movement = require("./movement");

var _movement2 = _interopRequireDefault(_movement);

var _damage = require("./damage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// players
//Check all ships
//ships with orders not done
//filter those not associated with players
//filter those not associated with active players
//make sure there are at least 2 active players 
//if 
const debug = require('debug')('aotds:mw');

const trycatch = ({
  getState
}) => next => action => {
  let state = getState();

  try {
    next(action);
  } catch (e) {
    debug(action);
    debug(state);
    throw e;
  }
};

exports.default = () => [_meta.add_timestamp, (0, _meta.add_action_id)(), (0, _meta.add_parent_action)(), _validate_schema2.default, _play_turn2.default, ..._weapons2.default, ..._movement2.default, _damage.calculate_damage, trycatch];