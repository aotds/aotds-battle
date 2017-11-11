'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _context;

var _redux = require('redux');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Reducer = require('./Reducer');

var _Reducer2 = _interopRequireDefault(_Reducer);

var _schema = require('./schema');

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _saga = require('./saga');

var _saga2 = _interopRequireDefault(_saga);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function for_actions() {
    var _this = this;

    for (var _len = arguments.length, actions = Array(_len), _key = 0; _key < _len; _key++) {
        actions[_key] = arguments[_key];
    }

    return function (store) {
        return function (next) {
            return function (action) {
                if (actions.indexOf(action.type) > -1) {
                    _this(store)(next)(action);
                } else {
                    next(action);
                }
            };
        };
    };
}

var MW_firecons_fire = (_context = function _context(store) {
    return function (next) {
        return function (action) {
            var state = store.getState();

            next(action);

            (0, _lodash2.default)((0, _lodash2.default)(state.objects).find({ id: action.object_id })).get('firecons', []).filter(function (f) {
                return f.target_id;
            }).forEach(function (f) {
                var a = _Actions2.default.firecon_fire({ object_id: action.object_id, firecon_id: f.id });
                console.log('a', a);
                store.dispatch(a);
            });
        };
    };
}, for_actions).call(_context, _Actions2.default.FIRECONS_FIRE);

var MW_firecon_fire = (_context = function _context(store) {
    return function (next) {
        return function (action) {
            var state = store.getState();

            next(action);

            var ship = _lodash2.default.find(state.objects, { id: action.object_id });

            var firecon = _lodash2.default.find(ship.firecons, { id: action.firecon_id });

            _lodash2.default.get(ship, 'weapons', []).filter(function (f) {
                return f.firecon_id === firecon.id;
            }).forEach(function (f) {
                var a = _Actions2.default.weapon_fire({ object_id: action.object_id, weapon_id: f.id, target_id: firecon.target_id });
                store.dispatch(a);
            });
        };
    };
}, for_actions).call(_context, _Actions2.default.FIRECON_FIRE);

function percolate_action() {
    var _this2 = this;

    return function (store) {
        return function (next) {
            return function (action) {
                next(action);
                _this2(store)(next)(action);
            };
        };
    };
}

var find_object = function find_object(id) {
    return _lodash2.default.find(this.objects, { id: id });
};
var find_firecon = function find_firecon(id) {
    return _lodash2.default.find(this.firecons, { id: id });
};
var find_weapon = function find_weapon(id) {
    return _lodash2.default.find(this.weapons, { id: id });
};

var middlewares = [MW_firecons_fire, MW_firecon_fire];

var Battle = function () {
    function Battle() {
        var _this3 = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Battle);

        this.init_game = function (payload) {
            return _this3.store.dispatch(_Actions2.default.init_game(payload));
        };

        var sagaMiddleware = (0, _reduxSaga2.default)();

        this.store = (0, _redux.createStore)(_Reducer2.default, options.state || {}, _redux.applyMiddleware.apply(undefined, middlewares.concat([sagaMiddleware])));
        sagaMiddleware.run(_saga2.default);

        // TODO only check for the schema in dev mode
        this.store.subscribe(function () {
            var _context2;

            (_context2 = _this3.store.getState(), _schema.validate).call(_context2, 'battle');
        });
    }

    _createClass(Battle, [{
        key: 'dispatch',
        value: function dispatch(action) {
            return this.store.dispatch(action);
        }
    }, {
        key: 'state',
        get: function get() {
            return this.store.getState();
        }
    }]);

    return Battle;
}();

exports.default = Battle;
;