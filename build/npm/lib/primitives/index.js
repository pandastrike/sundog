"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cognito = require("./cognito");

var _cognito2 = _interopRequireDefault(_cognito);

var _dynamodb = require("./dynamodb");

var _dynamodb2 = _interopRequireDefault(_dynamodb);

var _s = require("./s3");

var _s2 = _interopRequireDefault(_s);

var _sts = require("./sts");

var _sts2 = _interopRequireDefault(_sts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Primitives;

Primitives = function (_AWS) {
  return Object.defineProperties({}, {
    Cognito: {
      enumerable: true,
      get: function () {
        return (0, _cognito2.default)(_AWS);
      }
    },
    DynamoDB: {
      enumerable: true,
      get: function () {
        return (0, _dynamodb2.default)(_AWS);
      }
    },
    S3: {
      enumerable: true,
      get: function () {
        return (0, _s2.default)(_AWS);
      }
    },
    STS: {
      enumerable: true,
      get: function () {
        return (0, _sts2.default)(_AWS);
      }
    }
  });
};

exports.default = Primitives;