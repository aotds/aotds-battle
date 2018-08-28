"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _schemas = require("../schemas");

var _jsondiffpatch = require("jsondiffpatch");

var jsondiffpatch = _interopRequireWildcard(_jsondiffpatch);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const debug = require('debug')('aotds:mw:validate');

exports.default = ({
  getState
}) => next => action => {
  let previous = getState();
  let result = next(action);
  let current = getState();

  let valid = _schemas.ajv.validate({
    '$ref': 'http://aotds.babyl.ca/battle/game'
  }, current);

  if (valid) return;
  debug('action: %j', action);
  debug(_schemas.ajv.errors);
  debug(jsondiffpatch.console.format(jsondiffpatch.diff(previous, current)));
  throw new Error(`action ${action.type} caused state to become invalid`);
};