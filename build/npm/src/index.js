"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _liftAll = _interopRequireDefault(require("./lift-all"));

var _primitives = _interopRequireDefault(require("./primitives"));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUlBOztBQUNBOzs7O0FBTEE7OztBQUFBLElBQUEsS0FBQTs7QUFPQSxLQUFBLEdBQVEsVUFBQSxNQUFBLEVBQUE7U0FDTixNQUFNLENBQU4sZ0JBQUEsQ0FBQSxFQUFBLEVBQ0U7QUFBQSxJQUFBLElBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQUEsTUFBQSxDO0FBQUg7QUFETCxLQURGO0FBR0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHlCQUFXLEtBQVgsSUFBQSxDO0FBQUg7QUFETDtBQUpGLEdBREYsQztBQURNLENBQVI7O2VBU2UsSyIsInNvdXJjZXNDb250ZW50IjpbIiMgU3VuZG9nXG4jIEJhc2UgaXMgYSBzdXBlciB0aGluIHdyYXBwZXIgYXJvdW5kIHRoZSBBV1MgU0RLLCBsaWZ0aW5nIGVhY2ggc2VydmljZSBtb2R1bGUgc28geW91IG1heSB1c2UgdGhlbSB3aXRoIHByb21pc2VzIHJhdGhlciB0aGFuIGNhbGxiYWNrcy5cbiMgUHJpbWF0aXZlcyBpcyBhIHNsaWdodGx5IGhpZ2hlciBsZXZlbCB3cmFwcGVyIC0gc3RpbGwgcHJvbWlzZSBiYXNlZCAtIHRvIGdpdmUgdGhlIFNESyBhIG1vcmUgZnVuY3Rpb25hbCBmbGF2b3IuXG5cbmltcG9ydCBCYXNlIGZyb20gXCIuL2xpZnQtYWxsXCJcbmltcG9ydCBQcmltYXRpdmVzIGZyb20gXCIuL3ByaW1pdGl2ZXNcIlxuXG5zdGFydCA9IChlbmdpbmUpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIHt9LFxuICAgIF9BV1M6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IEJhc2UgZW5naW5lXG4gICAgQVdTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBQcmltYXRpdmVzIEBfQVdTXG5cbmV4cG9ydCBkZWZhdWx0IHN0YXJ0XG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/Repositories/sundog/src/index.coffee