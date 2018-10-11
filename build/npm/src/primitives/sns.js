"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lift = require("../lift");

// Primitives for the service SNS (simple notificaiton service).
var snsPrimitive;

snsPrimitive = function (SDK) {
  return function (configuration) {
    var sendSMS, sns;
    sns = (0, _lift.applyConfiguration)(configuration, SDK.SNS);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvc25zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7O0FBREE7QUFBQSxJQUFBLFlBQUE7O0FBR0EsWUFBQSxHQUFlLFVBQUEsR0FBQSxFQUFBO1NBQ2IsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLE9BQUEsRUFBQSxHQUFBO0FBQUEsSUFBQSxHQUFBLEdBQU0sOEJBQUEsYUFBQSxFQUFrQyxHQUFHLENBQXJDLEdBQUEsQ0FBTjs7QUFFQSxJQUFBLE9BQUEsR0FBVSxnQkFBQSxXQUFBLEVBQUEsT0FBQSxFQUFBO0FBQ1IsYUFBQSxNQUFNLEdBQUcsQ0FBSCxPQUFBLENBQVk7QUFBQSxRQUFBLFdBQUE7QUFBbEIsUUFBQTtBQUFrQixPQUFaLENBQU47QUFEUSxLQUFWOztXQUdBO0FBQUEsTUFBQTtBQUFBLEs7QUFORixHO0FBRGEsQ0FBZjs7ZUFTZSxZIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBTTlMgKHNpbXBsZSBub3RpZmljYWl0b24gc2VydmljZSkuXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5zbnNQcmltaXRpdmUgPSAoU0RLKSAtPlxuICAoY29uZmlndXJhdGlvbikgLT5cbiAgICBzbnMgPSBhcHBseUNvbmZpZ3VyYXRpb24gY29uZmlndXJhdGlvbiwgU0RLLlNOU1xuXG4gICAgc2VuZFNNUyA9IChQaG9uZU51bWJlciwgTWVzc2FnZSkgLT5cbiAgICAgIGF3YWl0IHNucy5wdWJsaXNoIHtQaG9uZU51bWJlciwgTWVzc2FnZX1cblxuICAgIHtzZW5kU01TfVxuXG5leHBvcnQgZGVmYXVsdCBzbnNQcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=primitives/sns.coffee