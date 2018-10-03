"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fairmont = require("fairmont");

var _lift = require("../lift");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Primitives for the service SES (simple email service).
var sesPrimitive;

sesPrimitive = function (SDK) {
  return function (configuration) {
    var sendEmail, ses;
    ses = (0, _lift.applyConfiguration)(configuration, SDK.SES);

    sendEmail =
    /*#__PURE__*/
    function () {
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
          Message: {
            Subject,
            Body
          }
        };
        params = (0, _fairmont.merge)(params, opts);
        return yield ses.sendEmail(params);
      });

      return function sendEmail(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }();

    return {
      sendEmail
    };
  };
};

var _default = sesPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvc2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUZBO0FBQUEsSUFBQSxZQUFBOztBQUlBLFlBQUEsR0FBZSxVQUFBLEdBQUEsRUFBQTtTQUNiLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxTQUFBLEVBQUEsR0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyxHQUFBLENBQU47O0FBRUEsSUFBQSxTQUFBO0FBQUE7QUFBQTtBQUFBLG1DQUFZLFdBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUEyQixNQUFBLEdBQTNCLE1BQUEsRUFBMEMsSUFBQSxHQUExQyxFQUFBLEVBQUE7QUFDVixZQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQVMsR0FBVDs7QUFDQSxZQUFHLHVCQUFILElBQUcsQ0FBSCxFQUFBO0FBQ0UsVUFBQSxXQUFBLEdBQWM7QUFBQSxZQUFBLFdBQUEsRUFBYTtBQUFiLFdBQWQ7QUFERixTQUFBLE1BRUssSUFBRyx3QkFBSCxJQUFHLENBQUgsRUFBQTtBQUNILFVBQUEsV0FBQSxHQURHLElBQ0g7QUFERyxTQUFBLE1BQUE7QUFHSCxVQUFBLFdBQUEsR0FBYztBQUFBLFlBQUEsV0FBQSxFQUFhLENBQUEsSUFBQTtBQUFiLFdBQWQ7OztBQUVGLFFBQUEsT0FBQSxHQUFVO0FBQUEsVUFBQSxJQUFBLEVBQU07QUFBTixTQUFWOztBQUNBLFlBQUcsTUFBQSxLQUFILE1BQUEsRUFBQTtBQUNFLFVBQUEsSUFBQSxHQUFPO0FBQUEsWUFBQSxJQUFBLEVBQU07QUFBQSxjQUFBLElBQUEsRUFBTTtBQUFOO0FBQU4sV0FBUDtBQURGLFNBQUEsTUFFSyxJQUFHLE1BQUEsS0FBSCxNQUFBLEVBQUE7QUFDSCxVQUFBLElBQUEsR0FBTztBQUFBLFlBQUEsSUFBQSxFQUFNO0FBQUEsY0FBQSxJQUFBLEVBQU07QUFBTjtBQUFOLFdBQVA7QUFERyxTQUFBLE1BQUE7QUFHSCxnQkFBTSxJQUFBLEtBQUEsQ0FISCxxQkFHRyxDQUFOOzs7QUFFRixRQUFBLE1BQUEsR0FBUztBQUFBLFVBQUEsTUFBQTtBQUFBLFVBQUEsV0FBQTtBQUdQLFVBQUEsT0FBQSxFQUFTO0FBQUEsWUFBQSxPQUFBO0FBQUEsWUFBQTtBQUFBO0FBSEYsU0FBVDtBQU1BLFFBQUEsTUFBQSxHQUFTLHFCQUFBLE1BQUEsRUFBQSxJQUFBLENBQVQ7QUFDQSxxQkFBTSxHQUFHLENBQUgsU0FBQSxDQUFOLE1BQU0sQ0FBTjtBQXhCVSxPQUFaOztBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUE7O1dBMEJBO0FBQUEsTUFBQTtBQUFBLEs7QUE3QkYsRztBQURhLENBQWY7O2VBaUNlLFkiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIFNFUyAoc2ltcGxlIGVtYWlsIHNlcnZpY2UpLlxuaW1wb3J0IHtpc09iamVjdCwgaXNBcnJheSwgbWVyZ2V9IGZyb20gXCJmYWlybW9udFwiXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5zZXNQcmltaXRpdmUgPSAoU0RLKSAtPlxuICAoY29uZmlndXJhdGlvbikgLT5cbiAgICBzZXMgPSBhcHBseUNvbmZpZ3VyYXRpb24gY29uZmlndXJhdGlvbiwgU0RLLlNFU1xuXG4gICAgc2VuZEVtYWlsID0gKHNyYywgZGVzdCwgc3ViamVjdCwgYm9keSwgZm9ybWF0PVwidGV4dFwiLCBvcHRzPXt9KSAtPlxuICAgICAgU291cmNlID0gc3JjXG4gICAgICBpZiBpc0FycmF5IGRlc3RcbiAgICAgICAgRGVzdGluYXRpb24gPSBUb0FkZHJlc3NlczogZGVzdFxuICAgICAgZWxzZSBpZiBpc09iamVjdCBkZXN0XG4gICAgICAgIERlc3RpbmF0aW9uID0gZGVzdFxuICAgICAgZWxzZVxuICAgICAgICBEZXN0aW5hdGlvbiA9IFRvQWRkcmVzc2VzOiBbZGVzdF1cblxuICAgICAgU3ViamVjdCA9IERhdGE6IHN1YmplY3RcbiAgICAgIGlmIGZvcm1hdCA9PSBcInRleHRcIlxuICAgICAgICBCb2R5ID0gVGV4dDogRGF0YTogYm9keVxuICAgICAgZWxzZSBpZiBmb3JtYXQgPT0gXCJodG1sXCJcbiAgICAgICAgQm9keSA9IEh0bWw6IERhdGE6IGJvZHlcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVW5rbm93biBib2R5IGZvcm1hdFwiXG5cbiAgICAgIHBhcmFtcyA9IHtcbiAgICAgICAgU291cmNlXG4gICAgICAgIERlc3RpbmF0aW9uXG4gICAgICAgIE1lc3NhZ2U6IHtTdWJqZWN0LCBCb2R5fVxuICAgICAgfVxuXG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdHNcbiAgICAgIGF3YWl0IHNlcy5zZW5kRW1haWwgcGFyYW1zXG5cbiAgICB7c2VuZEVtYWlsfVxuXG5cbmV4cG9ydCBkZWZhdWx0IHNlc1ByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=primitives/ses.coffee