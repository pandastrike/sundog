"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _lift = require("../lift");

// Primitives for the service SES (simple email service).
var sesPrimitive;

sesPrimitive = function (SDK) {
  return function (configuration) {
    var sendEmail, ses;
    ses = (0, _lift.applyConfiguration)(configuration, SDK.SES);

    sendEmail = async function (src, dest, subject, body, format = "text", opts = {}) {
      var Body, Destination, Source, Subject, params;
      Source = src;

      if ((0, _pandaParchment.isArray)(dest)) {
        Destination = {
          ToAddresses: dest
        };
      } else if ((0, _pandaParchment.isObject)(dest)) {
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
      params = (0, _pandaParchment.merge)(params, opts);
      return await ses.sendEmail(params);
    };

    return {
      sendEmail
    };
  };
};

var _default = sesPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL3Nlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQUNBOztBQUZBO0FBQUEsSUFBQSxZQUFBOztBQUlBLFlBQUEsR0FBZSxVQUFBLEdBQUEsRUFBQTtTQUNiLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxTQUFBLEVBQUEsR0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyxHQUFBLENBQU47O0FBRUEsSUFBQSxTQUFBLEdBQVksZ0JBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUEyQixNQUFBLEdBQTNCLE1BQUEsRUFBMEMsSUFBQSxHQUExQyxFQUFBLEVBQUE7QUFDVixVQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsR0FBVDs7QUFDQSxVQUFHLDZCQUFILElBQUcsQ0FBSCxFQUFBO0FBQ0UsUUFBQSxXQUFBLEdBQWM7QUFBQSxVQUFBLFdBQUEsRUFBYTtBQUFiLFNBQWQ7QUFERixPQUFBLE1BRUssSUFBRyw4QkFBSCxJQUFHLENBQUgsRUFBQTtBQUNILFFBQUEsV0FBQSxHQURHLElBQ0g7QUFERyxPQUFBLE1BQUE7QUFHSCxRQUFBLFdBQUEsR0FBYztBQUFBLFVBQUEsV0FBQSxFQUFhLENBQUEsSUFBQTtBQUFiLFNBQWQ7OztBQUVGLE1BQUEsT0FBQSxHQUFVO0FBQUEsUUFBQSxJQUFBLEVBQU07QUFBTixPQUFWOztBQUNBLFVBQUcsTUFBQSxLQUFILE1BQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPO0FBQUEsVUFBQSxJQUFBLEVBQU07QUFBQSxZQUFBLElBQUEsRUFBTTtBQUFOO0FBQU4sU0FBUDtBQURGLE9BQUEsTUFFSyxJQUFHLE1BQUEsS0FBSCxNQUFBLEVBQUE7QUFDSCxRQUFBLElBQUEsR0FBTztBQUFBLFVBQUEsSUFBQSxFQUFNO0FBQUEsWUFBQSxJQUFBLEVBQU07QUFBTjtBQUFOLFNBQVA7QUFERyxPQUFBLE1BQUE7QUFHSCxjQUFNLElBQUEsS0FBQSxDQUhILHFCQUdHLENBQU47OztBQUVGLE1BQUEsTUFBQSxHQUFTO0FBQUEsUUFBQSxNQUFBO0FBQUEsUUFBQSxXQUFBO0FBR1AsUUFBQSxPQUFBLEVBQVM7QUFBQSxVQUFBLE9BQUE7QUFBQSxVQUFBO0FBQUE7QUFIRixPQUFUO0FBTUEsTUFBQSxNQUFBLEdBQVMsMkJBQUEsTUFBQSxFQUFBLElBQUEsQ0FBVDtBQUNBLGFBQUEsTUFBTSxHQUFHLENBQUgsU0FBQSxDQUFOLE1BQU0sQ0FBTjtBQXhCVSxLQUFaOztXQTBCQTtBQUFBLE1BQUE7QUFBQSxLO0FBN0JGLEc7QUFEYSxDQUFmOztlQWlDZSxZIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBTRVMgKHNpbXBsZSBlbWFpbCBzZXJ2aWNlKS5cbmltcG9ydCB7aXNPYmplY3QsIGlzQXJyYXksIG1lcmdlfSBmcm9tIFwicGFuZGEtcGFyY2htZW50XCJcbmltcG9ydCB7YXBwbHlDb25maWd1cmF0aW9ufSBmcm9tIFwiLi4vbGlmdFwiXG5cbnNlc1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIHNlcyA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuU0VTXG5cbiAgICBzZW5kRW1haWwgPSAoc3JjLCBkZXN0LCBzdWJqZWN0LCBib2R5LCBmb3JtYXQ9XCJ0ZXh0XCIsIG9wdHM9e30pIC0+XG4gICAgICBTb3VyY2UgPSBzcmNcbiAgICAgIGlmIGlzQXJyYXkgZGVzdFxuICAgICAgICBEZXN0aW5hdGlvbiA9IFRvQWRkcmVzc2VzOiBkZXN0XG4gICAgICBlbHNlIGlmIGlzT2JqZWN0IGRlc3RcbiAgICAgICAgRGVzdGluYXRpb24gPSBkZXN0XG4gICAgICBlbHNlXG4gICAgICAgIERlc3RpbmF0aW9uID0gVG9BZGRyZXNzZXM6IFtkZXN0XVxuXG4gICAgICBTdWJqZWN0ID0gRGF0YTogc3ViamVjdFxuICAgICAgaWYgZm9ybWF0ID09IFwidGV4dFwiXG4gICAgICAgIEJvZHkgPSBUZXh0OiBEYXRhOiBib2R5XG4gICAgICBlbHNlIGlmIGZvcm1hdCA9PSBcImh0bWxcIlxuICAgICAgICBCb2R5ID0gSHRtbDogRGF0YTogYm9keVxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGJvZHkgZm9ybWF0XCJcblxuICAgICAgcGFyYW1zID0ge1xuICAgICAgICBTb3VyY2VcbiAgICAgICAgRGVzdGluYXRpb25cbiAgICAgICAgTWVzc2FnZToge1N1YmplY3QsIEJvZHl9XG4gICAgICB9XG5cbiAgICAgIHBhcmFtcyA9IG1lcmdlIHBhcmFtcywgb3B0c1xuICAgICAgYXdhaXQgc2VzLnNlbmRFbWFpbCBwYXJhbXNcblxuICAgIHtzZW5kRW1haWx9XG5cblxuZXhwb3J0IGRlZmF1bHQgc2VzUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/ses.coffee