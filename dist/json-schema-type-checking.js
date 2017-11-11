'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = ValidateSchema;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Ajv = require('ajv');
var StackTrace = require('stacktrace-js');
function ValidateSchema(options) {

    var validator = new Ajv({ '$data': true, useDefaults: true });

    var shall_validate = function shall_validate(schema) {
        var data = this;
        return new Promise(function (resolve, reject) {
            if (validator.validate(schema, data)) {
                resolve();
            } else {
                reject(validator.errors);
            }
        });
    };

    var validate = function validate(schema) {
        var data = this;

        shall_validate.call(data, schema).catch(function (errors) {
            StackTrace.get().then(function (stack) {
                options.on_validator_error('', { value: data, errors: errors,
                    stack: options.groom_stack(stack) });
            });
        });
    };

    if (options.schemas) {
        // TODO be smart if object or array
        _lodash2.default.forEach(options.schemas, function (v, k) {
            return validator.addSchema(v, k);
        });
    }

    if (!options.on_validator_error) {
        // let logger = require('tracer').colorConsole(
        //     { format: "<{{title}}> {{message}} (in {{file}}:{{line}})",
        //         inspectOpt: { depth: 10 },
        //         preprocess :  function(data){
        //         }
        //         });
        options.logger = require('pino')();
        options.on_validator_error = function (type, data) {
            logger.error(type + ' value failed validation', data);
        };
    }

    if (!options.groom_stack) {
        options.groom_stack = function (stack) {
            return stack.filter(function (s) {
                return !/json-schema-type-checking|module\.js|node\.js/.test(s.fileName);
            }).map(function (x) {
                return x.toString();
            });
        };
    }

    var with_args = function with_args(args_type) {
        var schema = typeof args_type == 'string' ? { '$ref': 'https://localhost/validate-schema/' + args_type } : _extends({ type: 'array' }, args_type);

        if (!schema.definitions) {
            try {
                schema.definitions = options.schema.definitions;
            } catch (e) {}
        }

        var validate = validator.compile(schema);
        var orig = this;

        return function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            if (!validate(args)) {
                StackTrace.get().then(function (stack) {
                    options.on_validator_error('args', { args: args, errors: validate.errors,
                        stack: options.groom_stack(stack) });
                });
            }

            return orig.call.apply(orig, [this].concat(args));
        };
    };

    var args = function args(args_type) {

        var schema = typeof args_type == 'string' ? { '$ref': 'https://localhost/validate-schema/' + args_type } : _extends({ type: 'array' }, args_type);

        if (!schema.definitions) {
            try {
                schema.definitions = options.schema.definitions;
            } catch (e) {}
        }

        var validate = validator.compile(schema);

        return function x(target, name, descriptor) {
            var func = descriptor.value;

            descriptor.value = function () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                if (!validate(args)) {
                    StackTrace.get().then(function (stack) {
                        options.on_validator_error('args', { args: args, errors: validate.errors,
                            stack: options.groom_stack(stack) });
                    });
                }

                return func.apply(undefined, args);
            };
        };
    };

    var returns = function returns(return_type) {
        var validate = validator.compile(typeof return_type == 'string' ? { '$ref': 'http://localhost/validate-schema' + return_type } : return_type);

        return function x(target, name, descriptor) {
            var func = descriptor.value;
            descriptor.value = function () {
                var args = arguments;
                var return_value = func.apply(undefined, arguments);

                if (!validate(return_value)) {
                    StackTrace.get().then(function (stack) {
                        options.on_validator_error('return', { value: return_value, errors: validate.errors,
                            stack: options.groom_stack(stack) });
                    });
                }

                return return_value;
            };
        };
    };

    var with_context = function with_context(return_type) {
        var orig = this;

        return function () {
            var _this = this;

            if (!validator.validate(return_type, this)) {
                StackTrace.get().then(function (stack) {
                    options.on_validator_error('context', {
                        value: _this,
                        errors: validator.errors,
                        stack: options.groom_stack(stack)
                    });
                });
            }

            return orig.call.apply(orig, [this].concat(Array.prototype.slice.call(arguments)));
        };
    };

    var with_return = function with_return(return_type) {
        var orig = this;

        return function () {
            var return_value = orig.call.apply(orig, [this].concat(Array.prototype.slice.call(arguments)));

            if (!validator.validate(return_type, return_value)) {
                var errors = validator.errors; // promise ahead!
                StackTrace.get().then(function (stack) {
                    options.on_validator_error('return', { value: return_value, errors: errors,
                        stack: options.groom_stack(stack) });
                });
            }

            return return_value;
        };
    };

    return { args: args, returns: returns, with_args: with_args, with_context: with_context, with_return: with_return,
        shall_validate: shall_validate, validate: validate };
}