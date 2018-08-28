"use strict";

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _dice = require("./dice");

var _jsonSchemaTypeChecking = require("../json-schema-type-checking");

var _jsonSchemaTypeChecking2 = _interopRequireDefault(_jsonSchemaTypeChecking);

var _schema = require("./schema");

var _schema2 = _interopRequireDefault(_schema);

var _Actions = require("./Actions");

var _Actions2 = _interopRequireDefault(_Actions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  with_args,
  returns,
  with_context,
  with_return
} = (0, _jsonSchemaTypeChecking2.default)({
  schemas: _schema2.default
});