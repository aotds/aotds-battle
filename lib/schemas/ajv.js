"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const Ajv = require('ajv');

exports.default = Ajv({
  '$data': true,
  useDefaults: true
});