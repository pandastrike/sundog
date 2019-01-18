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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL3Nucy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUNBOztBQURBO0FBQUEsSUFBQSxZQUFBOztBQUdBLFlBQUEsR0FBZSxVQUFBLEdBQUEsRUFBQTtTQUNiLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxPQUFBLEVBQUEsR0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyxHQUFBLENBQU47O0FBRUEsSUFBQSxPQUFBLEdBQVUsZ0JBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQTtBQUNSLGFBQUEsTUFBTSxHQUFHLENBQUgsT0FBQSxDQUFZO0FBQUEsUUFBQSxXQUFBO0FBQWxCLFFBQUE7QUFBa0IsT0FBWixDQUFOO0FBRFEsS0FBVjs7V0FHQTtBQUFBLE1BQUE7QUFBQSxLO0FBTkYsRztBQURhLENBQWY7O2VBU2UsWSIsInNvdXJjZXNDb250ZW50IjpbIiMgUHJpbWl0aXZlcyBmb3IgdGhlIHNlcnZpY2UgU05TIChzaW1wbGUgbm90aWZpY2FpdG9uIHNlcnZpY2UpLlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxuc25zUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgc25zID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5TTlNcblxuICAgIHNlbmRTTVMgPSAoUGhvbmVOdW1iZXIsIE1lc3NhZ2UpIC0+XG4gICAgICBhd2FpdCBzbnMucHVibGlzaCB7UGhvbmVOdW1iZXIsIE1lc3NhZ2V9XG5cbiAgICB7c2VuZFNNU31cblxuZXhwb3J0IGRlZmF1bHQgc25zUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/sns.coffee