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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvdXRpbHMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFGQSxJQUFBLFFBQUEsRUFBQSxLQUFBOzs7Ozs7QUFPQSxtQkFBQSxRQUFBLEdBQVcsVUFBQSxDQUFBLEVBQUksTUFBQSxHQUFKLEdBQUEsRUFBQSxJQUFBLEVBQUE7QUFDVCxNQUFBLENBQUEsQ0FBQSxJQUFBLElBQUEsR0FBRyxDQUFDLENBQUUsVUFBTixHQUFNLEtBQUgsQ0FBSCxNQUFBLE1BQUEsRUFBQTtBQUNFLFFBQVcsSUFBQSxJQUFRLENBQUMsQ0FBRCxJQUFBLEtBQW5CLElBQUEsRUFBQTtBQUFBLFlBQUEsQ0FBQTs7O1dBREYsSztBQUFBLEdBQUEsTUFBQTtBQUlFLFVBSkYsQ0FJRTs7QUFMTyxDQUFYOztBQU9BLGdCQUFBLEtBQUEsR0FBUSx3QkFBTSxVQUFBLE9BQUEsRUFBQSxDQUFBLEVBQUE7U0FBZ0Isd0JBQVEsMkJBQVIsT0FBUSxDQUFSLEVBQUEsQ0FBQSxDO0FBQXRCLENBQUEsQ0FBUiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3Vycnl9IGZyb20gXCJwYW5kYS1nYXJkZW5cIlxuaW1wb3J0IHtxdWVyeX0gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQge3NlbGVjdH0gZnJvbSBcInBhbmRhLXJpdmVyXCJcblxuXG4jIFNvbWUgU3VuRG9nIG1ldGhvZHMgcmV0dXJuIGZhbHNlIHdoZW4gYSByZXNvdXJjZSBjYW5ub3QgYmUgZm91bmQgaW5zdGVhZFxuIyBvZiB0aHJvd2luZyB0aGUgcmF3IEFXUyBlcnJvci4gIEluIGN1c3RvbSBjYXNlcywgdGhhdCdzIG5vdCBhbHdheXMgNDA0Llxubm90Rm91bmQgPSAoZSwgc3RhdHVzPTQwNCwgY29kZSkgLT5cbiAgaWYgZT8uc3RhdHVzQ29kZSA9PSBzdGF0dXNcbiAgICB0aHJvdyBlIGlmIGNvZGUgJiYgZS5jb2RlICE9IGNvZGVcbiAgICBmYWxzZVxuICBlbHNlXG4gICAgdGhyb3cgZVxuXG53aGVyZSA9IGN1cnJ5IChleGFtcGxlLCBpKSAtPiBzZWxlY3QgKHF1ZXJ5IGV4YW1wbGUpLCBpXG5cbmV4cG9ydCB7bm90Rm91bmQsIHdoZXJlfVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=primitives/utils.coffee