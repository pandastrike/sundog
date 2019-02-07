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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvc3RzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBREE7QUFBQSxJQUFBLFlBQUE7O0FBR0EsWUFBQSxHQUFlLFVBQUEsR0FBQSxFQUFBO1NBQ2IsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLEdBQUEsRUFBQSxNQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sOEJBQUEsYUFBQSxFQUFrQyxHQUFHLENBQXJDLEdBQUEsQ0FBTjs7QUFFQSxJQUFBLE1BQUEsR0FBUyxrQkFBQTtBQUFHLGFBQUEsTUFBTSxHQUFHLENBQVQsaUJBQU0sRUFBTjtBQUFILEtBQVQ7O1dBRUE7QUFBQSxNQUFBO0FBQUEsSztBQUxGLEc7QUFEYSxDQUFmOztlQVFlLFkiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIENvZ25pdG8uICBUaGUgYmFzZSBlbnRpdHkgaXMgdGhlIFwidXNlclwiLiAgTWV0aG9kcyB0aGF0IGFjdCBvbiBvdGhlciBlbnRpdGllcywgbGlrZSBwb29scyBvciBjbGllbnRzIGFyZSBwcmVmaXhlZCBhcyBzdWNoLlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxuc3RzUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgc3RzID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5TVFNcblxuICAgIHdob0FtSSA9IC0+IGF3YWl0IHN0cy5nZXRDYWxsZXJJZGVudGl0eSgpXG5cbiAgICB7d2hvQW1JfVxuXG5leHBvcnQgZGVmYXVsdCBzdHNQcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sundog/src/primitives/sts.coffee