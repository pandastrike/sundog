"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lift = require("../lift");

// Primitives for the service SNS (simple notificaiton service).
var snsPrimitive;

snsPrimitive = function (options) {
  return function (configuration) {
    var sendSMS, sns;
    sns = (0, _lift.prepareModule)(options, configuration, require("aws-sdk/clients/sns"), ["publish"]);

    sendSMS = async function (PhoneNumber, Message) {
      return await sns.publish({
        PhoneNumber,
        Message
      });
    };

    return {
      sendSMS
    };
  };
};

var _default = snsPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvc25zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBREE7QUFBQSxJQUFBLFlBQUE7O0FBR0EsWUFBQSxHQUFlLFVBQUEsT0FBQSxFQUFBO1NBQ2IsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0seUJBQUEsT0FBQSxFQUFBLGFBQUEsRUFDSixPQUFBLENBREkscUJBQ0osQ0FESSxFQUVKLENBRkksU0FFSixDQUZJLENBQU47O0FBTUEsSUFBQSxPQUFBLEdBQVUsZ0JBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQTtBQUNSLGFBQUEsTUFBTSxHQUFHLENBQUgsT0FBQSxDQUFZO0FBQUEsUUFBQSxXQUFBO0FBQWxCLFFBQUE7QUFBa0IsT0FBWixDQUFOO0FBRFEsS0FBVjs7V0FHQTtBQUFBLE1BQUE7QUFBQSxLO0FBVkYsRztBQURhLENBQWY7O2VBYWUsWSIsInNvdXJjZXNDb250ZW50IjpbIiMgUHJpbWl0aXZlcyBmb3IgdGhlIHNlcnZpY2UgU05TIChzaW1wbGUgbm90aWZpY2FpdG9uIHNlcnZpY2UpLlxuaW1wb3J0IHtwcmVwYXJlTW9kdWxlfSBmcm9tIFwiLi4vbGlmdFwiXG5cbnNuc1ByaW1pdGl2ZSA9IChvcHRpb25zKSAtPlxuICAoY29uZmlndXJhdGlvbikgLT5cbiAgICBzbnMgPSBwcmVwYXJlTW9kdWxlIG9wdGlvbnMsIGNvbmZpZ3VyYXRpb24sXG4gICAgICByZXF1aXJlKFwiYXdzLXNkay9jbGllbnRzL3Nuc1wiKSxcbiAgICAgIFtcbiAgICAgICAgXCJwdWJsaXNoXCJcbiAgICAgIF1cblxuICAgIHNlbmRTTVMgPSAoUGhvbmVOdW1iZXIsIE1lc3NhZ2UpIC0+XG4gICAgICBhd2FpdCBzbnMucHVibGlzaCB7UGhvbmVOdW1iZXIsIE1lc3NhZ2V9XG5cbiAgICB7c2VuZFNNU31cblxuZXhwb3J0IGRlZmF1bHQgc25zUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/repos/sundog/src/primitives/sns.coffee