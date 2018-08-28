"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ref;

var _actions = require("../actions");

var _selectors = require("./selectors");

var _utils = require("./utils");

const can_play_turn = ({
  getState
}) => next => action => {
  if (!action.force) {
    let state = getState();
    let not_done = (0, _selectors.get_players_not_done)(state);
    if (not_done.length) return;
    let active = (0, _selectors.get_active_players)(state);
    if (active.length <= 1) return;
  }

  next(action);
};

const play_inner = ({
  dispatch
}) => next => action => ['movement_phase', 'firecon_orders_phase', 'weapon_orders_phase', 'weapon_firing_phase', 'clear_orders'].map(a => dispatch(_actions.actions[a]()));

exports.default = (0, _utils.mw_for)(_actions.PLAY_TURN, (_ref = [can_play_turn, (0, _utils.subactions)(play_inner)], (0, _utils.mw_compose)(_ref)));