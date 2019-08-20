"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _lift = require("../lift");

// Primitives for the service SES (simple email service).
var sesPrimitive;

sesPrimitive = function (options) {
  return function (configuration) {
    var sendEmail, ses;
    ses = (0, _lift.prepareModule)(options, configuration, require("aws-sdk/clients/ses"), ["sendEmail"]);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvc2VzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBQ0E7O0FBRkE7QUFBQSxJQUFBLFlBQUE7O0FBSUEsWUFBQSxHQUFlLFVBQUEsT0FBQSxFQUFBO1NBQ2IsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLFNBQUEsRUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0seUJBQUEsT0FBQSxFQUFBLGFBQUEsRUFDSixPQUFBLENBREkscUJBQ0osQ0FESSxFQUVKLENBRkksV0FFSixDQUZJLENBQU47O0FBTUEsSUFBQSxTQUFBLEdBQVksZ0JBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsSUFBQSxFQUEyQixNQUFBLEdBQTNCLE1BQUEsRUFBMEMsSUFBQSxHQUExQyxFQUFBLEVBQUE7QUFDVixVQUFBLElBQUEsRUFBQSxXQUFBLEVBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsR0FBVDs7QUFDQSxVQUFHLDZCQUFILElBQUcsQ0FBSCxFQUFBO0FBQ0UsUUFBQSxXQUFBLEdBQWM7QUFBQSxVQUFBLFdBQUEsRUFBYTtBQUFiLFNBQWQ7QUFERixPQUFBLE1BRUssSUFBRyw4QkFBSCxJQUFHLENBQUgsRUFBQTtBQUNILFFBQUEsV0FBQSxHQURHLElBQ0g7QUFERyxPQUFBLE1BQUE7QUFHSCxRQUFBLFdBQUEsR0FBYztBQUFBLFVBQUEsV0FBQSxFQUFhLENBQUEsSUFBQTtBQUFiLFNBQWQ7OztBQUVGLE1BQUEsT0FBQSxHQUFVO0FBQUEsUUFBQSxJQUFBLEVBQU07QUFBTixPQUFWOztBQUNBLFVBQUcsTUFBQSxLQUFILE1BQUEsRUFBQTtBQUNFLFFBQUEsSUFBQSxHQUFPO0FBQUEsVUFBQSxJQUFBLEVBQU07QUFBQSxZQUFBLElBQUEsRUFBTTtBQUFOO0FBQU4sU0FBUDtBQURGLE9BQUEsTUFFSyxJQUFHLE1BQUEsS0FBSCxNQUFBLEVBQUE7QUFDSCxRQUFBLElBQUEsR0FBTztBQUFBLFVBQUEsSUFBQSxFQUFNO0FBQUEsWUFBQSxJQUFBLEVBQU07QUFBTjtBQUFOLFNBQVA7QUFERyxPQUFBLE1BQUE7QUFHSCxjQUFNLElBQUEsS0FBQSxDQUhILHFCQUdHLENBQU47OztBQUVGLE1BQUEsTUFBQSxHQUFTO0FBQUEsUUFBQSxNQUFBO0FBQUEsUUFBQSxXQUFBO0FBR1AsUUFBQSxPQUFBLEVBQVM7QUFBQSxVQUFBLE9BQUE7QUFBQSxVQUFBO0FBQUE7QUFIRixPQUFUO0FBTUEsTUFBQSxNQUFBLEdBQVMsMkJBQUEsTUFBQSxFQUFBLElBQUEsQ0FBVDtBQUNBLGFBQUEsTUFBTSxHQUFHLENBQUgsU0FBQSxDQUFOLE1BQU0sQ0FBTjtBQXhCVSxLQUFaOztXQTBCQTtBQUFBLE1BQUE7QUFBQSxLO0FBakNGLEc7QUFEYSxDQUFmOztlQXFDZSxZIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBTRVMgKHNpbXBsZSBlbWFpbCBzZXJ2aWNlKS5cbmltcG9ydCB7aXNPYmplY3QsIGlzQXJyYXksIG1lcmdlfSBmcm9tIFwicGFuZGEtcGFyY2htZW50XCJcbmltcG9ydCB7cHJlcGFyZU1vZHVsZX0gZnJvbSBcIi4uL2xpZnRcIlxuXG5zZXNQcmltaXRpdmUgPSAob3B0aW9ucykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgc2VzID0gcHJlcGFyZU1vZHVsZSBvcHRpb25zLCBjb25maWd1cmF0aW9uLFxuICAgICAgcmVxdWlyZShcImF3cy1zZGsvY2xpZW50cy9zZXNcIiksXG4gICAgICBbXG4gICAgICAgIFwic2VuZEVtYWlsXCJcbiAgICAgIF1cblxuICAgIHNlbmRFbWFpbCA9IChzcmMsIGRlc3QsIHN1YmplY3QsIGJvZHksIGZvcm1hdD1cInRleHRcIiwgb3B0cz17fSkgLT5cbiAgICAgIFNvdXJjZSA9IHNyY1xuICAgICAgaWYgaXNBcnJheSBkZXN0XG4gICAgICAgIERlc3RpbmF0aW9uID0gVG9BZGRyZXNzZXM6IGRlc3RcbiAgICAgIGVsc2UgaWYgaXNPYmplY3QgZGVzdFxuICAgICAgICBEZXN0aW5hdGlvbiA9IGRlc3RcbiAgICAgIGVsc2VcbiAgICAgICAgRGVzdGluYXRpb24gPSBUb0FkZHJlc3NlczogW2Rlc3RdXG5cbiAgICAgIFN1YmplY3QgPSBEYXRhOiBzdWJqZWN0XG4gICAgICBpZiBmb3JtYXQgPT0gXCJ0ZXh0XCJcbiAgICAgICAgQm9keSA9IFRleHQ6IERhdGE6IGJvZHlcbiAgICAgIGVsc2UgaWYgZm9ybWF0ID09IFwiaHRtbFwiXG4gICAgICAgIEJvZHkgPSBIdG1sOiBEYXRhOiBib2R5XG4gICAgICBlbHNlXG4gICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVua25vd24gYm9keSBmb3JtYXRcIlxuXG4gICAgICBwYXJhbXMgPSB7XG4gICAgICAgIFNvdXJjZVxuICAgICAgICBEZXN0aW5hdGlvblxuICAgICAgICBNZXNzYWdlOiB7U3ViamVjdCwgQm9keX1cbiAgICAgIH1cblxuICAgICAgcGFyYW1zID0gbWVyZ2UgcGFyYW1zLCBvcHRzXG4gICAgICBhd2FpdCBzZXMuc2VuZEVtYWlsIHBhcmFtc1xuXG4gICAge3NlbmRFbWFpbH1cblxuXG5leHBvcnQgZGVmYXVsdCBzZXNQcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sundog/src/primitives/ses.coffee