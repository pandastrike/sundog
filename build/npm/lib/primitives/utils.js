"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Some SunDog methods return false when a resource cannot be found instead
// of throwing the raw AWS error.  In custom cases, that's not always 404.
var notFound;

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

exports.notFound = notFound;