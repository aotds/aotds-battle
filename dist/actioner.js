'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Actioner = function () {
    function Actioner() {
        _classCallCheck(this, Actioner);

        this.actions = {};
    }

    _createClass(Actioner, [{
        key: 'add',
        value: function add(name, payload_transformer) {
            if (typeof payload_transformer === 'boolean' && !payload_transformer) {
                this.actions[name.toLowerCase()] = function () {
                    return {
                        type: name.toUpperCase()
                    };
                };
                return;
            }

            this.actions[name.toLowerCase()] = function (payload) {
                return {
                    type: name.toUpperCase(),
                    payload: payload
                };
            };
        }
    }, {
        key: 'names',
        value: function names() {
            return Object.keys(this.actions).map(function (s) {
                return s.toUpperCase();
            });
        }
    }, {
        key: 'combined',
        value: function combined() {
            var combined = _extends({}, this.actions);

            Object.keys(combined).forEach(function (k) {
                return combined[k.toUpperCase()] = k.toUpperCase();
            });

            return combined;
        }
    }]);

    return Actioner;
}();

exports.default = Actioner;