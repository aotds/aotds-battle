"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ValidateSchema;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Ajv = require('ajv');

const StackTrace = require('stacktrace-js');

function ValidateSchema(options) {
  let shall_validate = function (schema) {
    let data = this;
    return new Promise((resolve, reject) => {
      if (validator.validate(schema, data)) {
        resolve();
      } else {
        reject(validator.errors);
      }
    });
  };

  let validate = function (schema) {
    let data = this;
    shall_validate.call(data, schema).catch(errors => {
      StackTrace.get().then(stack => {
        options.on_validator_error('', {
          value: data,
          errors,
          stack: options.groom_stack(stack)
        });
      });
    });
  };

  if (options.schemas) {
    // TODO be smart if object or array
    _lodash2.default.forEach(options.schemas, (v, k) => validator.addSchema(v, k));
  }

  if (!options.on_validator_error) {
    // let logger = require('tracer').colorConsole(
    //     { format: "<{{title}}> {{message}} (in {{file}}:{{line}})",
    //         inspectOpt: { depth: 10 },
    //         preprocess :  function(data){
    //         }
    //         });
    options.logger = require('pino')();

    options.on_validator_error = (type, data) => {
      logger.error(type + ' value failed validation', data);
    };
  }

  if (!options.groom_stack) {
    options.groom_stack = stack => stack.filter(s => !/json-schema-type-checking|module\.js|node\.js/.test(s.fileName)).map(x => x.toString());
  }

  let with_args = function (args_type) {
    let schema = typeof args_type == 'string' ? {
      '$ref': 'https://localhost/validate-schema/' + args_type
    } : _extends({
      type: 'array'
    }, args_type);

    if (!schema.definitions) {
      try {
        schema.definitions = options.schema.definitions;
      } catch (e) {}
    }

    let validate = validator.compile(schema);
    let orig = this;
    return function (...args) {
      if (!validate(args)) {
        StackTrace.get().then(stack => {
          options.on_validator_error('args', {
            args: args,
            errors: validate.errors,
            stack: options.groom_stack(stack)
          });
        });
      }

      return orig.call(this, ...args);
    };
  };

  let args = function (args_type) {
    let schema = typeof args_type == 'string' ? {
      '$ref': 'https://localhost/validate-schema/' + args_type
    } : _extends({
      type: 'array'
    }, args_type);

    if (!schema.definitions) {
      try {
        schema.definitions = options.schema.definitions;
      } catch (e) {}
    }

    let validate = validator.compile(schema);
    return function x(target, name, descriptor) {
      let func = descriptor.value;

      descriptor.value = function (...args) {
        if (!validate(args)) {
          StackTrace.get().then(stack => {
            options.on_validator_error('args', {
              args: args,
              errors: validate.errors,
              stack: options.groom_stack(stack)
            });
          });
        }

        return func(...args);
      };
    };
  };

  let returns = function (return_type) {
    let validate = validator.compile(typeof return_type == 'string' ? {
      '$ref': 'http://localhost/validate-schema' + return_type
    } : return_type);
    return function x(target, name, descriptor) {
      let func = descriptor.value;

      descriptor.value = function () {
        let args = arguments;
        let return_value = func(...arguments);

        if (!validate(return_value)) {
          StackTrace.get().then(stack => {
            options.on_validator_error('return', {
              value: return_value,
              errors: validate.errors,
              stack: options.groom_stack(stack)
            });
          });
        }

        return return_value;
      };
    };
  };

  let with_context = function (return_type) {
    let orig = this;
    return function () {
      if (!validator.validate(return_type, this)) {
        StackTrace.get().then(stack => {
          options.on_validator_error('context', {
            value: this,
            errors: validator.errors,
            stack: options.groom_stack(stack)
          });
        });
      }

      return orig.call(this, ...arguments);
    };
  };

  let with_return = function (return_type) {
    let orig = this;
    return function () {
      let return_value = orig.call(this, ...arguments);

      if (!validator.validate(return_type, return_value)) {
        let errors = validator.errors; // promise ahead!

        StackTrace.get().then(stack => {
          options.on_validator_error('return', {
            value: return_value,
            errors,
            stack: options.groom_stack(stack)
          });
        });
      }

      return return_value;
    };
  };

  return {
    args,
    returns,
    with_args,
    with_context,
    with_return,
    shall_validate,
    validate
  };
}