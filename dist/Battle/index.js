'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redux = require('redux');

var _reduxSaga = require('redux-saga');

var _reduxSaga2 = _interopRequireDefault(_reduxSaga);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Logger = require('../Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _Reducer = require('./Reducer');

var _Reducer2 = _interopRequireDefault(_Reducer);

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _Sagas = require('./Sagas');

var _Sagas2 = _interopRequireDefault(_Sagas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MW_logger = function MW_logger(store) {
    return function (next) {
        return function (action) {
            _Logger2.default.trace({ action: action }, 'action entering middleware');
            next(action);
        };
    };
};

var Battle = function () {
    function Battle() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Battle);

        var MW_saga = (0, _reduxSaga2.default)();

        this.store = (0, _redux.createStore)(_Reducer2.default, options.state || {}, (0, _redux.applyMiddleware)(MW_logger, MW_saga));
        MW_saga.run(_Sagas2.default);
    }

    // init_game = payload => this.store.dispatch(
    //     Action.init_game(payload)
    // ) 

    _createClass(Battle, [{
        key: 'dispatch',
        value: function dispatch(action) {
            return this.store.dispatch(action);
        }
    }, {
        key: 'dispatch_action',
        value: function dispatch_action(type, payload) {
            return this.dispatch({ type: type, payload: payload });
        }

        // init a game

    }, {
        key: 'init',
        value: function init(init_options) {
            this.dispatch(_Actions2.default.init_game(init_options));
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