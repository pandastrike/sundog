"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notFound = void 0;
// Some SunDog methods return false when a resource cannot be found instead
// of throwing the raw AWS error.  In custom cases, that's not always 404.
var notFound;
exports.notFound = notFound;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUFBLElBQUEsUUFBQTs7O0FBRUEsbUJBQUEsUUFBQSxHQUFXLFVBQUEsQ0FBQSxFQUFJLE1BQUEsR0FBSixHQUFBLEVBQUEsSUFBQSxFQUFBO0FBQ1QsTUFBQSxDQUFBLENBQUEsSUFBQSxJQUFBLEdBQUcsQ0FBQyxDQUFFLFVBQU4sR0FBTSxLQUFILENBQUgsTUFBQSxNQUFBLEVBQUE7QUFDRSxRQUFXLElBQUEsSUFBUSxDQUFDLENBQUQsSUFBQSxLQUFuQixJQUFBLEVBQUE7QUFBQSxZQUFBLENBQUE7OztXQURGLEs7QUFBQSxHQUFBLE1BQUE7QUFJRSxVQUpGLENBSUU7O0FBTE8sQ0FBWCIsInNvdXJjZXNDb250ZW50IjpbIiMgU29tZSBTdW5Eb2cgbWV0aG9kcyByZXR1cm4gZmFsc2Ugd2hlbiBhIHJlc291cmNlIGNhbm5vdCBiZSBmb3VuZCBpbnN0ZWFkXG4jIG9mIHRocm93aW5nIHRoZSByYXcgQVdTIGVycm9yLiAgSW4gY3VzdG9tIGNhc2VzLCB0aGF0J3Mgbm90IGFsd2F5cyA0MDQuXG5ub3RGb3VuZCA9IChlLCBzdGF0dXM9NDA0LCBjb2RlKSAtPlxuICBpZiBlPy5zdGF0dXNDb2RlID09IHN0YXR1c1xuICAgIHRocm93IGUgaWYgY29kZSAmJiBlLmNvZGUgIT0gY29kZVxuICAgIGZhbHNlXG4gIGVsc2VcbiAgICB0aHJvdyBlXG5cbmV4cG9ydCB7bm90Rm91bmR9XG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=primitives/utils.coffee