"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dynamodb = require("./dynamodb");

var _dynamodb2 = _interopRequireDefault(_dynamodb);

var _s = require("./s3");

var _s2 = _interopRequireDefault(_s);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Primitives;

Primitives = function (_AWS) {
  return Object.defineProperties({}, {
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
    }
  });
};

exports.default = Primitives;