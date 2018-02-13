"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var stsPrimative;

stsPrimative = function (_AWS) {
  var sts, whoAmI;
  sts = _AWS.STS;
  whoAmI = (() => {
    var _ref = _asyncToGenerator(function* () {
      return yield sts.getCallerIdentity();
    });

    return function whoAmI() {
      return _ref.apply(this, arguments);
    };
  })();
  return { whoAmI };
};

exports.default = stsPrimative;