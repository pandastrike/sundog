"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lift = require("../lift");

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var stsPrimitive;

stsPrimitive = function (SDK) {
  return function (configuration) {
    var sts, whoAmI;
    sts = (0, _lift.applyConfiguration)(configuration, SDK.STS);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL3N0cy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQURBO0FBQUEsSUFBQSxZQUFBOztBQUdBLFlBQUEsR0FBZSxVQUFBLEdBQUEsRUFBQTtTQUNiLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBLEVBQUEsTUFBQTtBQUFBLElBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyxHQUFBLENBQU47O0FBRUEsSUFBQSxNQUFBLEdBQVMsa0JBQUE7QUFBRyxhQUFBLE1BQU0sR0FBRyxDQUFULGlCQUFNLEVBQU47QUFBSCxLQUFUOztXQUVBO0FBQUEsTUFBQTtBQUFBLEs7QUFMRixHO0FBRGEsQ0FBZjs7ZUFRZSxZIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBDb2duaXRvLiAgVGhlIGJhc2UgZW50aXR5IGlzIHRoZSBcInVzZXJcIi4gIE1ldGhvZHMgdGhhdCBhY3Qgb24gb3RoZXIgZW50aXRpZXMsIGxpa2UgcG9vbHMgb3IgY2xpZW50cyBhcmUgcHJlZml4ZWQgYXMgc3VjaC5cbmltcG9ydCB7YXBwbHlDb25maWd1cmF0aW9ufSBmcm9tIFwiLi4vbGlmdFwiXG5cbnN0c1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIHN0cyA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuU1RTXG5cbiAgICB3aG9BbUkgPSAtPiBhd2FpdCBzdHMuZ2V0Q2FsbGVySWRlbnRpdHkoKVxuXG4gICAge3dob0FtSX1cblxuZXhwb3J0IGRlZmF1bHQgc3RzUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/sts.coffee