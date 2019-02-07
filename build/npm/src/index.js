"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Helpers", {
  enumerable: true,
  get: function () {
    return _helpers.default;
  }
});
exports.default = void 0;

var _liftAll = _interopRequireDefault(require("./lift-all"));

var _primitives = _interopRequireDefault(require("./primitives"));

var _helpers = _interopRequireDefault(require("./helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Sundog
// Base is a super thin wrapper around the AWS SDK, lifting each service module so you may use them with promises rather than callbacks.
// Primatives is a slightly higher level wrapper - still promise based - to give the SDK a more functional flavor.
var start;

start = function (engine) {
  return Object.defineProperties({}, {
    _AWS: {
      enumerable: true,
      get: function () {
        return (0, _liftAll.default)(engine);
      }
    },
    AWS: {
      enumerable: true,
      get: function () {
        return (0, _primitives.default)(this._AWS);
      }
    }
  });
};

var _default = start;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBSUE7O0FBQ0E7O0FBQ0E7Ozs7QUFOQTs7O0FBQUEsSUFBQSxLQUFBOztBQVFBLEtBQUEsR0FBUSxVQUFBLE1BQUEsRUFBQTtTQUNOLE1BQU0sQ0FBTixnQkFBQSxDQUFBLEVBQUEsRUFDRTtBQUFBLElBQUEsSUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxzQkFBQSxNQUFBLEM7QUFBSDtBQURMLEtBREY7QUFHQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcseUJBQVcsS0FBWCxJQUFBLEM7QUFBSDtBQURMO0FBSkYsR0FERixDO0FBRE0sQ0FBUjs7ZUFTZSxLIiwic291cmNlc0NvbnRlbnQiOlsiIyBTdW5kb2dcbiMgQmFzZSBpcyBhIHN1cGVyIHRoaW4gd3JhcHBlciBhcm91bmQgdGhlIEFXUyBTREssIGxpZnRpbmcgZWFjaCBzZXJ2aWNlIG1vZHVsZSBzbyB5b3UgbWF5IHVzZSB0aGVtIHdpdGggcHJvbWlzZXMgcmF0aGVyIHRoYW4gY2FsbGJhY2tzLlxuIyBQcmltYXRpdmVzIGlzIGEgc2xpZ2h0bHkgaGlnaGVyIGxldmVsIHdyYXBwZXIgLSBzdGlsbCBwcm9taXNlIGJhc2VkIC0gdG8gZ2l2ZSB0aGUgU0RLIGEgbW9yZSBmdW5jdGlvbmFsIGZsYXZvci5cblxuaW1wb3J0IEJhc2UgZnJvbSBcIi4vbGlmdC1hbGxcIlxuaW1wb3J0IFByaW1hdGl2ZXMgZnJvbSBcIi4vcHJpbWl0aXZlc1wiXG5pbXBvcnQgSGVscGVycyBmcm9tIFwiLi9oZWxwZXJzXCJcblxuc3RhcnQgPSAoZW5naW5lKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyB7fSxcbiAgICBfQVdTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBCYXNlIGVuZ2luZVxuICAgIEFXUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gUHJpbWF0aXZlcyBAX0FXU1xuXG5leHBvcnQgZGVmYXVsdCBzdGFydFxuZXhwb3J0IHtIZWxwZXJzfVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sundog/src/index.coffee