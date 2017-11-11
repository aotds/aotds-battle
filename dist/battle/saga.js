'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = _callee;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _effects = require('redux-saga/effects');

var _Actions = require('./Actions');

var _Actions2 = _interopRequireDefault(_Actions);

var _weapons = require('./weapons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [_callee].map(regeneratorRuntime.mark);

var find_object = function find_object(state, id) {
    return _lodash2.default.find(state.objects, { id: id });
};
var find_weapon = function find_weapon(ship, id) {
    return _lodash2.default.find(ship.weapons, { id: id });
};

var check_if_object_destroyed = regeneratorRuntime.mark(function check_if_object_destroyed(action) {
    var ship;
    return regeneratorRuntime.wrap(function check_if_object_destroyed$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return (0, _effects.select)(find_object, action.object_id);

                case 2:
                    ship = _context.sent;

                    if (!ship.is_destroyed) {
                        _context.next = 5;
                        break;
                    }

                    return _context.abrupt('return');

                case 5:
                    if (!(ship.hull <= 0)) {
                        _context.next = 8;
                        break;
                    }

                    _context.next = 8;
                    return (0, _effects.put)(_Actions2.default.destroyed({ object_id: ship.id }));

                case 8:
                case 'end':
                    return _context.stop();
            }
        }
    }, check_if_object_destroyed, this);
});

var fire_weapon = regeneratorRuntime.mark(function fire_weapon(action) {
    var ship, target, weapon, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _action;

    return regeneratorRuntime.wrap(function fire_weapon$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    _context2.next = 2;
                    return (0, _effects.select)(find_object, action.object_id);

                case 2:
                    ship = _context2.sent;
                    _context2.next = 5;
                    return (0, _effects.select)(find_object, action.target_id);

                case 5:
                    target = _context2.sent;
                    weapon = find_weapon(ship, action.weapon_id);
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context2.prev = 10;
                    _iterator = (0, _weapons.weapon_fire)(ship, target, weapon)[Symbol.iterator]();

                case 12:
                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                        _context2.next = 19;
                        break;
                    }

                    _action = _step.value;
                    _context2.next = 16;
                    return (0, _effects.put)(_action);

                case 16:
                    _iteratorNormalCompletion = true;
                    _context2.next = 12;
                    break;

                case 19:
                    _context2.next = 25;
                    break;

                case 21:
                    _context2.prev = 21;
                    _context2.t0 = _context2['catch'](10);
                    _didIteratorError = true;
                    _iteratorError = _context2.t0;

                case 25:
                    _context2.prev = 25;
                    _context2.prev = 26;

                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }

                case 28:
                    _context2.prev = 28;

                    if (!_didIteratorError) {
                        _context2.next = 31;
                        break;
                    }

                    throw _iteratorError;

                case 31:
                    return _context2.finish(28);

                case 32:
                    return _context2.finish(25);

                case 33:
                case 'end':
                    return _context2.stop();
            }
        }
    }, fire_weapon, this, [[10, 21, 25, 33], [26,, 28, 32]]);
});

function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.next = 2;
                    return (0, _effects.takeEvery)(_Actions2.default.DAMAGE, check_if_object_destroyed);

                case 2:
                    _context3.next = 4;
                    return (0, _effects.takeEvery)(_Actions2.default.WEAPON_FIRE, fire_weapon);

                case 4:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _marked[0], this);
}