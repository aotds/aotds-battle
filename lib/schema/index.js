"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonSchemaShorthand = require("../json-schema-shorthand");

var _jsonSchemaShorthand2 = _interopRequireDefault(_jsonSchemaShorthand);

var _stacktraceJs = require("stacktrace-js");

var _stacktraceJs2 = _interopRequireDefault(_stacktraceJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const Ajv = require('ajv');

const debug = require('debug')('schema');

let SchemaValidationError = class SchemaValidationError extends Error {
  constructor(options) {
    super("validation failed");
    this.type = options.type;
    this.validation_value = options.validation_value;
    this.validation_errors = options.validation_errors;
  }

};
let Schema = class Schema {
  constructor(options = {}) {
    this.validator = new Ajv({
      '$data': true,
      useDefaults: true,
      loadSchema: this.loadSchema
    });
    this.skipStack = [/node\.js/, /node_modules/, /module\.js/];

    this.stackFilter = entry => !this.skipStack.find(re => re.test(entry.fileName));

    this.fatal = options.fatal;
    this.schema_url = options.schema_url;
  }

  async loadSchema(schema) {
    schema = schema.replace(/^~/, './');

    let raw = _extends({}, require(schema).default);

    raw['$id'] = this.schema_url + schema.replace(/^\./, '');
    return raw;
  }

  async validate(which, schema, value, stack) {
    try {
      let validate = await this.validator.compileAsync(schema);
      if (validate(value)) return; //  let stack = await StackTrace.get();

      if (stack) {
        stack = await stack;
      }

      stack.shift();
      let error = {
        type: which,
        validation_errors: validate.errors,
        validation_value: value
      };
      error = new SchemaValidationError(error);

      if (this.fatal) {
        setTimeout(() => {
          throw error;
        }, 0);
      }

      debug("%s schema error: %O\nvalue:%O\ntrace: %O", which, validate.errors, value, stack.map(s => s.toString()));
    } catch (e) {
      throw e;
    }
  }

  jssert_f(input, output, context) {
    let schema = this;

    if (input instanceof Array) {
      input = {
        type: 'array',
        items: input
      };
    }

    input = (0, _jsonSchemaShorthand2.default)(input);
    output = (0, _jsonSchemaShorthand2.default)(output);
    context = (0, _jsonSchemaShorthand2.default)(context);
    return f => function (...args) {
      if (input !== undefined) {
        schema.validate('function arguments', input, args, _stacktraceJs2.default.get({
          filter: schema.stackFilter
        }));
      }

      let result = f(...args);

      if (output !== undefined) {
        schema.validate('function output', output, result, _stacktraceJs2.default.get({
          filter: schema.stackFilter
        })).catch(e => {
          console.log(e);
        });
      }

      return result;
    };
  }

};
let schema = new Schema({
  fatal: true,
  schema_url: "http://aotds/battle"
});
exports.default = schema;