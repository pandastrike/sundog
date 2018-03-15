"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service SES (simple email service).
var sesPrimative;

sesPrimative = function (_AWS) {
  var sendEmail, ses;
  ses = _AWS.SES;
  sendEmail = (() => {
    var _ref = _asyncToGenerator(function* (src, dest, subject, body, format = "text", opts = {}) {
      var Body, Destination, Source, Subject, params;
      Source = src;
      if ((0, _fairmont.isArray)(dest)) {
        Destination = {
          ToAddresses: dest
        };
      } else if ((0, _fairmont.isObject)(dest)) {
        Destination = dest;
      } else {
        Destination = {
          ToAddresses: [dest]
        };
      }
      Subject = {
        Data: subject
      };
      if (format === "text") {
        Body = {
          Text: {
            Data: body
          }
        };
      } else if (format === "html") {
        Body = {
          Html: {
            Data: body
          }
        };
      } else {
        throw new Error("Unknown body format");
      }
      params = {
        Source,
        Destination,
        Message: { Subject, Body }
      };
      params = (0, _fairmont.merge)(params, opts);
      console.log(params);
      return yield ses.sendEmail(params);
    });

    return function sendEmail(_x, _x2, _x3, _x4) {
      return _ref.apply(this, arguments);
    };
  })();
  return { sendEmail };
};

exports.default = sesPrimative;