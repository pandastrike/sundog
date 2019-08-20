"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lift = require("../lift");

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var stsPrimitive;

stsPrimitive = function (options) {
  return function (configuration) {
    var sts, whoAmI;
    sts = (0, _lift.prepareModule)(options, configuration, require("aws-sdk/clients/sts"), ["getCallerIdentity"]);

    whoAmI = async function () {
      return await sts.getCallerIdentity();
    };

    return {
      whoAmI
    };
  };
};

var _default = stsPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvc3RzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBREE7QUFBQSxJQUFBLFlBQUE7O0FBR0EsWUFBQSxHQUFlLFVBQUEsT0FBQSxFQUFBO1NBQ2IsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsRUFBQSxNQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0seUJBQUEsT0FBQSxFQUFBLGFBQUEsRUFDSixPQUFBLENBREkscUJBQ0osQ0FESSxFQUVKLENBRkksbUJBRUosQ0FGSSxDQUFOOztBQU1BLElBQUEsTUFBQSxHQUFTLGtCQUFBO0FBQUcsYUFBQSxNQUFNLEdBQUcsQ0FBVCxpQkFBTSxFQUFOO0FBQUgsS0FBVDs7V0FFQTtBQUFBLE1BQUE7QUFBQSxLO0FBVEYsRztBQURhLENBQWY7O2VBWWUsWSIsInNvdXJjZXNDb250ZW50IjpbIiMgUHJpbWl0aXZlcyBmb3IgdGhlIHNlcnZpY2UgQ29nbml0by4gIFRoZSBiYXNlIGVudGl0eSBpcyB0aGUgXCJ1c2VyXCIuICBNZXRob2RzIHRoYXQgYWN0IG9uIG90aGVyIGVudGl0aWVzLCBsaWtlIHBvb2xzIG9yIGNsaWVudHMgYXJlIHByZWZpeGVkIGFzIHN1Y2guXG5pbXBvcnQge3ByZXBhcmVNb2R1bGV9IGZyb20gXCIuLi9saWZ0XCJcblxuc3RzUHJpbWl0aXZlID0gKG9wdGlvbnMpIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIHN0cyA9IHByZXBhcmVNb2R1bGUgb3B0aW9ucywgY29uZmlndXJhdGlvbixcbiAgICAgIHJlcXVpcmUoXCJhd3Mtc2RrL2NsaWVudHMvc3RzXCIpLFxuICAgICAgW1xuICAgICAgICBcImdldENhbGxlcklkZW50aXR5XCJcbiAgICAgIF1cblxuICAgIHdob0FtSSA9IC0+IGF3YWl0IHN0cy5nZXRDYWxsZXJJZGVudGl0eSgpXG5cbiAgICB7d2hvQW1JfVxuXG5leHBvcnQgZGVmYXVsdCBzdHNQcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sundog/src/primitives/sts.coffee