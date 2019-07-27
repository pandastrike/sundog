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
        return (0, _primitives.default)(this._AWS, engine);
      }
    }
  });
};

var _default = start;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBSUE7O0FBQ0E7O0FBQ0E7Ozs7QUFOQTs7O0FBQUEsSUFBQSxLQUFBOztBQVFBLEtBQUEsR0FBUSxVQUFBLE1BQUEsRUFBQTtTQUNOLE1BQU0sQ0FBTixnQkFBQSxDQUFBLEVBQUEsRUFDRTtBQUFBLElBQUEsSUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxzQkFBQSxNQUFBLEM7QUFBSDtBQURMLEtBREY7QUFHQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcseUJBQVcsS0FBWCxJQUFBLEVBQUEsTUFBQSxDO0FBQUg7QUFETDtBQUpGLEdBREYsQztBQURNLENBQVI7O2VBU2UsSyIsInNvdXJjZXNDb250ZW50IjpbIiMgU3VuZG9nXG4jIEJhc2UgaXMgYSBzdXBlciB0aGluIHdyYXBwZXIgYXJvdW5kIHRoZSBBV1MgU0RLLCBsaWZ0aW5nIGVhY2ggc2VydmljZSBtb2R1bGUgc28geW91IG1heSB1c2UgdGhlbSB3aXRoIHByb21pc2VzIHJhdGhlciB0aGFuIGNhbGxiYWNrcy5cbiMgUHJpbWF0aXZlcyBpcyBhIHNsaWdodGx5IGhpZ2hlciBsZXZlbCB3cmFwcGVyIC0gc3RpbGwgcHJvbWlzZSBiYXNlZCAtIHRvIGdpdmUgdGhlIFNESyBhIG1vcmUgZnVuY3Rpb25hbCBmbGF2b3IuXG5cbmltcG9ydCBCYXNlIGZyb20gXCIuL2xpZnQtYWxsXCJcbmltcG9ydCBQcmltYXRpdmVzIGZyb20gXCIuL3ByaW1pdGl2ZXNcIlxuaW1wb3J0IEhlbHBlcnMgZnJvbSBcIi4vaGVscGVyc1wiXG5cbnN0YXJ0ID0gKGVuZ2luZSkgLT5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMge30sXG4gICAgX0FXUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gQmFzZSBlbmdpbmVcbiAgICBBV1M6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IFByaW1hdGl2ZXMgQF9BV1MsIGVuZ2luZVxuXG5leHBvcnQgZGVmYXVsdCBzdGFydFxuZXhwb3J0IHtIZWxwZXJzfVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sundog/src/index.coffee