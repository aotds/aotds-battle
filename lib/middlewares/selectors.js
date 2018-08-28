'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.get_object_by_id = undefined;
exports.active_players = active_players;
exports.players_not_done = players_not_done;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fp = require('lodash/fp');

var _fp2 = _interopRequireDefault(_fp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('aotds:mw:selector');

const get_object_by_id = exports.get_object_by_id = (store, id) => _lodash2.default.find(store.objects, { id });

function active_players(state) {
    return _fp2.default.reject({ status: 'inactive' })(state.game.players);
};

function players_not_done(state) {
    let players = _lodash2.default.get(state, 'game.players', []);

    const with_player = _fp2.default.filter('player_id');
    const not_ready = _fp2.default.reject('orders.done');

    let obj_not_ready = not_ready(with_player(state.objects));

    let players_not_ready = _fp2.default.map('player_id')(obj_not_ready);

    const player_not_ready = _fp2.default.filter(p => _lodash2.default.includes(players_not_ready, p.id));

    return _fp2.default.map('id')(player_not_ready(active_players(state)));
}