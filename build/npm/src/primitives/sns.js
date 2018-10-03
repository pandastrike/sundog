"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lift = require("../lift");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Primitives for the service SNS (simple notificaiton service).
var snsPrimitive;

snsPrimitive = function (SDK) {
  return function (configuration) {
    var sendSMS, sns;
    sns = (0, _lift.applyConfiguration)(configuration, SDK.SNS);

    sendSMS =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (PhoneNumber, Message) {
        return yield sns.publish({
          PhoneNumber,
          Message
        });
      });

      return function sendSMS(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    return {
      sendSMS
    };
  };
};

var _default = snsPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvc25zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQ0E7Ozs7OztBQURBO0FBQUEsSUFBQSxZQUFBOztBQUdBLFlBQUEsR0FBZSxVQUFBLEdBQUEsRUFBQTtTQUNiLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxPQUFBLEVBQUEsR0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyxHQUFBLENBQU47O0FBRUEsSUFBQSxPQUFBO0FBQUE7QUFBQTtBQUFBLG1DQUFVLFdBQUEsV0FBQSxFQUFBLE9BQUEsRUFBQTtBQUNSLHFCQUFNLEdBQUcsQ0FBSCxPQUFBLENBQVk7QUFBQSxVQUFBLFdBQUE7QUFBbEIsVUFBQTtBQUFrQixTQUFaLENBQU47QUFEUSxPQUFWOztBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUE7O1dBR0E7QUFBQSxNQUFBO0FBQUEsSztBQU5GLEc7QUFEYSxDQUFmOztlQVNlLFkiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIFNOUyAoc2ltcGxlIG5vdGlmaWNhaXRvbiBzZXJ2aWNlKS5cbmltcG9ydCB7YXBwbHlDb25maWd1cmF0aW9ufSBmcm9tIFwiLi4vbGlmdFwiXG5cbnNuc1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIHNucyA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuU05TXG5cbiAgICBzZW5kU01TID0gKFBob25lTnVtYmVyLCBNZXNzYWdlKSAtPlxuICAgICAgYXdhaXQgc25zLnB1Ymxpc2gge1Bob25lTnVtYmVyLCBNZXNzYWdlfVxuXG4gICAge3NlbmRTTVN9XG5cbmV4cG9ydCBkZWZhdWx0IHNuc1ByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=primitives/sns.coffee