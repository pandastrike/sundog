"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.where = exports.notFound = void 0;

var _pandaGarden = require("panda-garden");

var _pandaParchment = require("panda-parchment");

var _pandaRiver = require("panda-river");

var notFound, where;
exports.where = where;
exports.notFound = notFound;

// Some SunDog methods return false when a resource cannot be found instead
// of throwing the raw AWS error.  In custom cases, that's not always 404.
exports.notFound = notFound = function (e, status = 404, code) {
  if ((e != null ? e.statusCode : void 0) === status) {
    if (code && e.code !== code) {
      throw e;
    }

    return false;
  } else {
    throw e;
  }
};

exports.where = where = (0, _pandaGarden.curry)(function (example, i) {
  return (0, _pandaRiver.select)((0, _pandaParchment.query)(example), i);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL3V0aWxzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRkEsSUFBQSxRQUFBLEVBQUEsS0FBQTs7Ozs7O0FBT0EsbUJBQUEsUUFBQSxHQUFXLFVBQUEsQ0FBQSxFQUFJLE1BQUEsR0FBSixHQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ1QsTUFBQSxDQUFBLENBQUEsSUFBQSxJQUFBLEdBQUcsQ0FBQyxDQUFFLFVBQU4sR0FBTSxLQUFILENBQUgsTUFBQSxNQUFBLEVBQUE7QUFDRSxRQUFXLElBQUEsSUFBUSxDQUFDLENBQUQsSUFBQSxLQUFuQixJQUFBLEVBQUE7QUFBQSxZQUFBLENBQUE7OztXQURGLEs7QUFBQSxHQUFBLE1BQUE7QUFJRSxVQUpGLENBSUU7O0FBTE8sQ0FBWDs7QUFPQSxnQkFBQSxLQUFBLEdBQVEsd0JBQU0sVUFBQSxPQUFBLEVBQUEsQ0FBQSxFQUFBO1NBQWdCLHdCQUFRLDJCQUFSLE9BQVEsQ0FBUixFQUFBLENBQUEsQztBQUF0QixDQUFBLENBQVIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2N1cnJ5fSBmcm9tIFwicGFuZGEtZ2FyZGVuXCJcbmltcG9ydCB7cXVlcnl9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHtzZWxlY3R9IGZyb20gXCJwYW5kYS1yaXZlclwiXG5cblxuIyBTb21lIFN1bkRvZyBtZXRob2RzIHJldHVybiBmYWxzZSB3aGVuIGEgcmVzb3VyY2UgY2Fubm90IGJlIGZvdW5kIGluc3RlYWRcbiMgb2YgdGhyb3dpbmcgdGhlIHJhdyBBV1MgZXJyb3IuICBJbiBjdXN0b20gY2FzZXMsIHRoYXQncyBub3QgYWx3YXlzIDQwNC5cbm5vdEZvdW5kID0gKGUsIHN0YXR1cz00MDQsIGNvZGUpIC0+XG4gIGlmIGU/LnN0YXR1c0NvZGUgPT0gc3RhdHVzXG4gICAgdGhyb3cgZSBpZiBjb2RlICYmIGUuY29kZSAhPSBjb2RlXG4gICAgZmFsc2VcbiAgZWxzZVxuICAgIHRocm93IGVcblxud2hlcmUgPSBjdXJyeSAoZXhhbXBsZSwgaSkgLT4gc2VsZWN0IChxdWVyeSBleGFtcGxlKSwgaVxuXG5leHBvcnQge25vdEZvdW5kLCB3aGVyZX1cbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/utils.coffee