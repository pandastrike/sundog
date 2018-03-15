"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service SNS (simple notificaiton service).
var snsPrimative;

snsPrimative = function (_AWS) {
  var sendSMS, sns;
  sns = _AWS.SNS;
  sendSMS = (() => {
    var _ref = _asyncToGenerator(function* (PhoneNumber, Message) {
      return yield sns.publish({ PhoneNumber, Message });
    });

    return function sendSMS(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
  return { sendSMS };
};

exports.default = snsPrimative;