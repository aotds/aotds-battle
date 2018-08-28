'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _reducer = require('./reducer');

var _reducer2 = _interopRequireDefault(_reducer);

var _middlewares = require('./middlewares');

var _middlewares2 = _interopRequireDefault(_middlewares);

var _schemas = require('./schemas');

var _schemas2 = _interopRequireDefault(_schemas);

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('aotds:battle');

var schemas = new _schemas2.default();

var Battle = function () {
    function Battle() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Battle);

        this.store = (0, _redux.createStore)(_reducer2.default, state, _redux.applyMiddleware.apply(undefined, _toConsumableArray(_middlewares2.default)));

        // this.store.subscribe( () => {
        //      schemas.validate(
        //          { '$ref': 'http://aotds.babyl.ca/battle/game_turn'},
        //          this.state
        //      )
        // });
    }

    _createClass(Battle, [{
        key: 'dispatch',
        value: function dispatch(action) {
            return this.store.dispatch(action);
        }
    }, {
        key: 'init_game',
        value: function init_game(message) {
            return this.store.dispatch(_actions2.default.init_game(message));
        }
    }, {
        key: 'set_orders',
        value: function set_orders(ship, orders) {
            return this.store.dispatch(_actions2.default.set_orders(ship, orders));
        }
    }, {
        key: 'play_turn',
        value: function play_turn() {
            var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return this.store.dispatch(_actions2.default.play_turn(force));
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

/**
 * build middlewares for only certain types of actions
 * @param actions list of action types the middleware should be invoked for
 */
/*
function for_actions(...actions) {
    return store => next => action => {
        if (  actions.indexOf( action.type ) > -1 ) {
            this(store)(next)(action);
        }
        else {
            next(action);
        }
    };
}

const MW_firecons_fire = ( store => next => action => {
    let state = store.getState();

    next(action);

    _( _(state.objects).find({ id: action.object_id }) )
        .get( 'firecons', [] )
        .filter( f => f.target_id )
        .forEach( f => {
            let a = Action.firecon_fire({ object_id: action.object_id, firecon_id: f.id });
            console.log( 'a', a );
            store.dispatch(a);
        });
} ) ::for_actions( Action.FIRECONS_FIRE );

const MW_firecon_fire = ( store => next => action => {
    let state = store.getState();

    next(action);

    let ship = _.find( state.objects, { id: action.object_id } );

    let firecon = _.find( ship.firecons, { id: action.firecon_id } );

     _.get( ship, 'weapons', [] )
        .filter( f => f.firecon_id === firecon.id )
        .forEach( f => {
            let a = Action.weapon_fire({ object_id: action.object_id, weapon_id: f.id, target_id: firecon.target_id });
            store.dispatch(a);
        });
} ) ::for_actions( Action.FIRECON_FIRE );

function percolate_action() {
    return  store => next => action => {
        next(action);
        this(store)(next)(action);
    };
}

const find_object  = function(id) { return _.find( this.objects,  { id } ) };
const find_firecon = function(id) { return _.find( this.firecons, { id } ) };
const find_weapon  = function(id) { return _.find( this.weapons,  { id } ) };


let middlewares = [
    MW_firecons_fire,
    MW_firecon_fire,
];

import createSagaMiddleware from 'redux-saga';
import battle_saga from './saga';



*/