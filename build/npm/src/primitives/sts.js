"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lift = require("../lift");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var stsPrimitive;

stsPrimitive = function (SDK) {
  return function (configuration) {
    var sts, whoAmI;
    sts = (0, _lift.applyConfiguration)(configuration, SDK.STS);

    whoAmI =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* () {
        return yield sts.getCallerIdentity();
      });

      return function whoAmI() {
        return _ref.apply(this, arguments);
      };
    }();

    return {
      whoAmI
    };
  };
};

var _default = stsPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvc3RzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7OztBQURBO0FBQUEsSUFBQSxZQUFBOztBQUdBLFlBQUEsR0FBZSxVQUFBLEdBQUEsRUFBQTtTQUNiLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBLEVBQUEsTUFBQTtBQUFBLElBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyxHQUFBLENBQU47O0FBRUEsSUFBQSxNQUFBO0FBQUE7QUFBQTtBQUFBLG1DQUFTLGFBQUE7QUFBRyxxQkFBTSxHQUFHLENBQVQsaUJBQU0sRUFBTjtBQUFILE9BQVQ7O0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBQTs7V0FFQTtBQUFBLE1BQUE7QUFBQSxLO0FBTEYsRztBQURhLENBQWY7O2VBUWUsWSIsInNvdXJjZXNDb250ZW50IjpbIiMgUHJpbWl0aXZlcyBmb3IgdGhlIHNlcnZpY2UgQ29nbml0by4gIFRoZSBiYXNlIGVudGl0eSBpcyB0aGUgXCJ1c2VyXCIuICBNZXRob2RzIHRoYXQgYWN0IG9uIG90aGVyIGVudGl0aWVzLCBsaWtlIHBvb2xzIG9yIGNsaWVudHMgYXJlIHByZWZpeGVkIGFzIHN1Y2guXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5zdHNQcmltaXRpdmUgPSAoU0RLKSAtPlxuICAoY29uZmlndXJhdGlvbikgLT5cbiAgICBzdHMgPSBhcHBseUNvbmZpZ3VyYXRpb24gY29uZmlndXJhdGlvbiwgU0RLLlNUU1xuXG4gICAgd2hvQW1JID0gLT4gYXdhaXQgc3RzLmdldENhbGxlcklkZW50aXR5KClcblxuICAgIHt3aG9BbUl9XG5cbmV4cG9ydCBkZWZhdWx0IHN0c1ByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=primitives/sts.coffee