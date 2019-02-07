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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvc2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBRkE7QUFBQSxJQUFBLFlBQUE7O0FBSUEsWUFBQSxHQUFlLFVBQUEsR0FBQSxFQUFBO1NBQ2IsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLFNBQUEsRUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sOEJBQUEsYUFBQSxFQUFrQyxHQUFHLENBQXJDLEdBQUEsQ0FBTjs7QUFFQSxJQUFBLFNBQUEsR0FBWSxnQkFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQTJCLE1BQUEsR0FBM0IsTUFBQSxFQUEwQyxJQUFBLEdBQTFDLEVBQUEsRUFBQTtBQUNWLFVBQUEsSUFBQSxFQUFBLFdBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxHQUFUOztBQUNBLFVBQUcsNkJBQUgsSUFBRyxDQUFILEVBQUE7QUFDRSxRQUFBLFdBQUEsR0FBYztBQUFBLFVBQUEsV0FBQSxFQUFhO0FBQWIsU0FBZDtBQURGLE9BQUEsTUFFSyxJQUFHLDhCQUFILElBQUcsQ0FBSCxFQUFBO0FBQ0gsUUFBQSxXQUFBLEdBREcsSUFDSDtBQURHLE9BQUEsTUFBQTtBQUdILFFBQUEsV0FBQSxHQUFjO0FBQUEsVUFBQSxXQUFBLEVBQWEsQ0FBQSxJQUFBO0FBQWIsU0FBZDs7O0FBRUYsTUFBQSxPQUFBLEdBQVU7QUFBQSxRQUFBLElBQUEsRUFBTTtBQUFOLE9BQVY7O0FBQ0EsVUFBRyxNQUFBLEtBQUgsTUFBQSxFQUFBO0FBQ0UsUUFBQSxJQUFBLEdBQU87QUFBQSxVQUFBLElBQUEsRUFBTTtBQUFBLFlBQUEsSUFBQSxFQUFNO0FBQU47QUFBTixTQUFQO0FBREYsT0FBQSxNQUVLLElBQUcsTUFBQSxLQUFILE1BQUEsRUFBQTtBQUNILFFBQUEsSUFBQSxHQUFPO0FBQUEsVUFBQSxJQUFBLEVBQU07QUFBQSxZQUFBLElBQUEsRUFBTTtBQUFOO0FBQU4sU0FBUDtBQURHLE9BQUEsTUFBQTtBQUdILGNBQU0sSUFBQSxLQUFBLENBSEgscUJBR0csQ0FBTjs7O0FBRUYsTUFBQSxNQUFBLEdBQVM7QUFBQSxRQUFBLE1BQUE7QUFBQSxRQUFBLFdBQUE7QUFHUCxRQUFBLE9BQUEsRUFBUztBQUFBLFVBQUEsT0FBQTtBQUFBLFVBQUE7QUFBQTtBQUhGLE9BQVQ7QUFNQSxNQUFBLE1BQUEsR0FBUywyQkFBQSxNQUFBLEVBQUEsSUFBQSxDQUFUO0FBQ0EsYUFBQSxNQUFNLEdBQUcsQ0FBSCxTQUFBLENBQU4sTUFBTSxDQUFOO0FBeEJVLEtBQVo7O1dBMEJBO0FBQUEsTUFBQTtBQUFBLEs7QUE3QkYsRztBQURhLENBQWY7O2VBaUNlLFkiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIFNFUyAoc2ltcGxlIGVtYWlsIHNlcnZpY2UpLlxuaW1wb3J0IHtpc09iamVjdCwgaXNBcnJheSwgbWVyZ2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxuc2VzUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgc2VzID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5TRVNcblxuICAgIHNlbmRFbWFpbCA9IChzcmMsIGRlc3QsIHN1YmplY3QsIGJvZHksIGZvcm1hdD1cInRleHRcIiwgb3B0cz17fSkgLT5cbiAgICAgIFNvdXJjZSA9IHNyY1xuICAgICAgaWYgaXNBcnJheSBkZXN0XG4gICAgICAgIERlc3RpbmF0aW9uID0gVG9BZGRyZXNzZXM6IGRlc3RcbiAgICAgIGVsc2UgaWYgaXNPYmplY3QgZGVzdFxuICAgICAgICBEZXN0aW5hdGlvbiA9IGRlc3RcbiAgICAgIGVsc2VcbiAgICAgICAgRGVzdGluYXRpb24gPSBUb0FkZHJlc3NlczogW2Rlc3RdXG5cbiAgICAgIFN1YmplY3QgPSBEYXRhOiBzdWJqZWN0XG4gICAgICBpZiBmb3JtYXQgPT0gXCJ0ZXh0XCJcbiAgICAgICAgQm9keSA9IFRleHQ6IERhdGE6IGJvZHlcbiAgICAgIGVsc2UgaWYgZm9ybWF0ID09IFwiaHRtbFwiXG4gICAgICAgIEJvZHkgPSBIdG1sOiBEYXRhOiBib2R5XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVua25vd24gYm9keSBmb3JtYXRcIlxuXG4gICAgICBwYXJhbXMgPSB7XG4gICAgICAgIFNvdXJjZVxuICAgICAgICBEZXN0aW5hdGlvblxuICAgICAgICBNZXNzYWdlOiB7U3ViamVjdCwgQm9keX1cbiAgICAgIH1cblxuICAgICAgcGFyYW1zID0gbWVyZ2UgcGFyYW1zLCBvcHRzXG4gICAgICBhd2FpdCBzZXMuc2VuZEVtYWlsIHBhcmFtc1xuXG4gICAge3NlbmRFbWFpbH1cblxuXG5leHBvcnQgZGVmYXVsdCBzZXNQcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sundog/src/primitives/ses.coffee