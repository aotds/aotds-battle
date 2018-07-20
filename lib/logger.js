'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = require('pino')({
    level: process.env.LEVEL || 'fatal'
}, process.stderr);