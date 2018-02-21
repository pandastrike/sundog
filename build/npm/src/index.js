"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lifted = require("./lifted");

var _lifted2 = _interopRequireDefault(_lifted);

var _primitives = require("./primitives");

var _primitives2 = _interopRequireDefault(_primitives);

var _helpers = require("./helpers");

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import Engine from "./engine"
var start;

start = function (engine) {
  return Object.defineProperties({}, {
    _AWS: {
      enumerable: true,
      get: function () {
        return (0, _lifted2.default)(engine);
      }
    },
    AWS: {
      enumerable: true,
      get: function () {
        return (0, _primitives2.default)(this._AWS);
      }
    },
    Helpers: {
      enumerable: true,
      get: function () {
        return (0, _helpers2.default)(this.AWS);
      }
    }
  });
};

exports.default = start;