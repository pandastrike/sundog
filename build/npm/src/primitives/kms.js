"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fairmont = require("fairmont");

var _utils = require("./utils");

var _lift = require("../lift");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Primitives for the service KMS.
// NOTE: In KMS methods besides "create" and "delete" and "addAlias": ID can be key ID, key ARN, or key alias name.
var cognitoPrimitive;

cognitoPrimitive = function (SDK) {
  return function (configuration) {
    var addAlias, create, decrypt, encrypt, get, kms, randomKey, reEncrypt, removeAlias, scheduleDelete;
    kms = (0, _lift.applyConfiguration)(configuration, SDK.KMS);

    get =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(function* (id, tokens) {
        var KeyMetadata, e, params;

        try {
          params = {
            KeyId: id
          };

          if (tokens) {
            params.GrantTokens = tokens;
          }

          ({
            KeyMetadata
          } = yield kms.describeKey(params));
          return KeyMetadata;
        } catch (error) {
          e = error;
          return (0, _utils.notFound)(e, 400, "NotFoundException");
        }
      });

      return function get(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    create =
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(function* (params = {}) {
        var KeyMetadata;
        ({
          KeyMetadata
        } = yield kms.createKey(params));
        return KeyMetadata;
      });

      return function create() {
        return _ref2.apply(this, arguments);
      };
    }();

    scheduleDelete =
    /*#__PURE__*/
    function () {
      var _ref3 = _asyncToGenerator(function* (id, delay) {
        var params;
        params = {
          KeyId: id
        };

        if (delay) {
          params.PendingWindowInDays = delay;
        }

        return yield kms.deleteKey(params);
      });

      return function scheduleDelete(_x3, _x4) {
        return _ref3.apply(this, arguments);
      };
    }();

    addAlias =
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(function* (TargetKeyId, AliasName) {
        return yield kms.createAlias({
          TargetKeyId,
          AliasName
        });
      });

      return function addAlias(_x5, _x6) {
        return _ref4.apply(this, arguments);
      };
    }();

    removeAlias =
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(function* (AliasName) {
        return yield kms.deleteAlias({
          AliasName
        });
      });

      return function removeAlias(_x7) {
        return _ref5.apply(this, arguments);
      };
    }();

    randomKey =
    /*#__PURE__*/
    function () {
      var _ref6 = _asyncToGenerator(function* (size, encoding = "hex") {
        var Plaintext;
        ({
          Plaintext
        } = yield kms.generateRandom({
          NumberOfBytes: size
        }));

        switch (encoding) {
          case "buffer":
            return Plaintext;

          case "ascii":
          case "hex":
          case "utf8":
          case "utf16le":
          case "ucs2":
          case "latin1":
          case "binary":
          case "hex":
            return Plaintext.toString(encoding);

          case "base64":
            // Omitting padding characters, per:
            // https://tools.ietf.org/html/rfc4648#section-3.2
            return Plaintext.toString("base64").replace(/\=+$/, '');

          case "base64padded":
            return Plaintext.toString("base64");

          case "base64url":
            // Based on RFC 4648's "base64url" mapping:
            // https://tools.ietf.org/html/rfc4648#section-5
            return Plaintext.toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');

          default:
            throw new Error(`Unknown encoding ${encoding}.`);
        }
      });

      return function randomKey(_x8) {
        return _ref6.apply(this, arguments);
      };
    }();

    encrypt =
    /*#__PURE__*/
    function () {
      var _ref7 = _asyncToGenerator(function* (id, plaintext, encoding = "utf8", options = {}) {
        var CiphertextBlob, input, params;

        switch (encoding) {
          case "utf8":
          case "base64":
          case "hex":
          case "ascii":
          case "utf16le":
          case "ucs2":
          case "latin1":
          case "binary":
            input = Buffer.from(plaintext, encoding);
            break;

          case "buffer":
            input = plaintext;
            break;

          default:
            throw new Error(`Unknown encoding ${encoding}.`);
        }

        params = {
          KeyId: id,
          Plaintext: input
        };
        params = (0, _fairmont.merge)(params, options);
        ({
          CiphertextBlob
        } = yield kms.encrypt(params));
        return CiphertextBlob.toString("base64");
      });

      return function encrypt(_x9, _x10) {
        return _ref7.apply(this, arguments);
      };
    }();

    decrypt =
    /*#__PURE__*/
    function () {
      var _ref8 = _asyncToGenerator(function* (blob, encoding = "utf8", options = {}) {
        var Plaintext, params;
        params = {
          CiphertextBlob: Buffer.from(blob, "base64")
        };
        params = (0, _fairmont.merge)(params, options);
        ({
          Plaintext
        } = yield kms.decrypt(params));

        switch (encoding) {
          case "utf8":
          case "base64":
          case "hex":
          case "ascii":
          case "utf16le":
          case "ucs2":
          case "latin1":
          case "binary":
            return Plaintext.toString(encoding);

          case "buffer":
            return Plaintext;

          default:
            throw new Error(`Unknown encoding ${encoding}.`);
        }
      });

      return function decrypt(_x11) {
        return _ref8.apply(this, arguments);
      };
    }();

    reEncrypt =
    /*#__PURE__*/
    function () {
      var _ref9 = _asyncToGenerator(function* (id, blob, options = {}) {
        var CiphertextBlob, params;
        params = {
          DestinationKeyId: id,
          CyphertextBlob: Buffer.from(blob, "base64")
        };
        params = (0, _fairmont.merge)(params, options);
        ({
          CiphertextBlob
        } = yield kms.reEncrypt(params));
        return CiphertextBlob.toString("base64");
      });

      return function reEncrypt(_x12, _x13) {
        return _ref9.apply(this, arguments);
      };
    }();

    return {
      get,
      create,
      scheduleDelete,
      addAlias,
      removeAlias,
      randomKey,
      decrypt,
      encrypt,
      reEncrypt
    };
  };
};

var _default = cognitoPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMva21zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUxBOztBQUFBLElBQUEsZ0JBQUE7O0FBT0EsZ0JBQUEsR0FBbUIsVUFBQSxHQUFBLEVBQUE7U0FDakIsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBLGNBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSw4QkFBQSxhQUFBLEVBQWtDLEdBQUcsQ0FBckMsR0FBQSxDQUFOOztBQUVBLElBQUEsR0FBQTtBQUFBO0FBQUE7QUFBQSxtQ0FBTSxXQUFBLEVBQUEsRUFBQSxNQUFBLEVBQUE7QUFDSixZQUFBLFdBQUEsRUFBQSxDQUFBLEVBQUEsTUFBQTs7QUFBQSxZQUFBO0FBQ0UsVUFBQSxNQUFBLEdBQVM7QUFBQyxZQUFBLEtBQUEsRUFBTztBQUFSLFdBQVQ7O0FBQ0EsY0FBQSxNQUFBLEVBQUE7QUFBQSxZQUFBLE1BQU0sQ0FBTixXQUFBLEdBQUEsTUFBQTs7O0FBQ0EsV0FBQTtBQUFBLFlBQUE7QUFBQSxvQkFBc0IsR0FBRyxDQUFILFdBQUEsQ0FBdEIsTUFBc0IsQ0FBdEI7aUJBSEYsVztBQUFBLFNBQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUtNLFVBQUEsQ0FBQSxHQUFBLEtBQUE7aUJBQ0oscUJBQUEsQ0FBQSxFQUFBLEdBQUEsRUFORixtQkFNRSxDOztBQVBFLE9BQU47O0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBQTs7QUFTQSxJQUFBLE1BQUE7QUFBQTtBQUFBO0FBQUEsb0NBQVMsV0FBQyxNQUFBLEdBQUQsRUFBQSxFQUFBO0FBQ1AsWUFBQSxXQUFBO0FBQUEsU0FBQTtBQUFBLFVBQUE7QUFBQSxrQkFBc0IsR0FBRyxDQUFILFNBQUEsQ0FBdEIsTUFBc0IsQ0FB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QTtBQUFBO0FBQUEsb0NBQVksV0FBQSxFQUFBLEVBQUEsSUFBQSxFQUFXLE9BQUEsR0FBWCxFQUFBLEVBQUE7QUFDVixZQUFBLGNBQUEsRUFBQSxNQUFBO0FBQUEsUUFBQSxNQUFBLEdBQ0U7QUFBQSxVQUFBLGdCQUFBLEVBQUEsRUFBQTtBQUNBLFVBQUEsY0FBQSxFQUFnQixNQUFNLENBQU4sSUFBQSxDQUFBLElBQUEsRUFBQSxRQUFBO0FBRGhCLFNBREY7QUFHQSxRQUFBLE1BQUEsR0FBUyxxQkFBQSxNQUFBLEVBQUEsT0FBQSxDQUFUO0FBQ0EsU0FBQTtBQUFBLFVBQUE7QUFBQSxrQkFBeUIsR0FBRyxDQUFILFNBQUEsQ0FBekIsTUFBeUIsQ0FBekI7ZUFDQSxjQUFjLENBQWQsUUFBQSxDQUFBLFFBQUEsQztBQU5VLE9BQVo7O0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FBQTs7V0FTQTtBQUFBLE1BQUEsR0FBQTtBQUFBLE1BQUEsTUFBQTtBQUFBLE1BQUEsY0FBQTtBQUFBLE1BQUEsUUFBQTtBQUFBLE1BQUEsV0FBQTtBQUFBLE1BQUEsU0FBQTtBQUFBLE1BQUEsT0FBQTtBQUFBLE1BQUEsT0FBQTtBQUFBLE1BQUE7QUFBQSxLO0FBdkZGLEc7QUFEaUIsQ0FBbkI7O2VBMkZlLGdCIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBLTVMuXG4jIE5PVEU6IEluIEtNUyBtZXRob2RzIGJlc2lkZXMgXCJjcmVhdGVcIiBhbmQgXCJkZWxldGVcIiBhbmQgXCJhZGRBbGlhc1wiOiBJRCBjYW4gYmUga2V5IElELCBrZXkgQVJOLCBvciBrZXkgYWxpYXMgbmFtZS5cblxuaW1wb3J0IHtjYXQsIG1lcmdlfSBmcm9tIFwiZmFpcm1vbnRcIlxuaW1wb3J0IHtub3RGb3VuZH0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxuY29nbml0b1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIGttcyA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuS01TXG5cbiAgICBnZXQgPSAoaWQsIHRva2VucykgLT5cbiAgICAgIHRyeVxuICAgICAgICBwYXJhbXMgPSB7S2V5SWQ6IGlkfVxuICAgICAgICBwYXJhbXMuR3JhbnRUb2tlbnMgPSB0b2tlbnMgaWYgdG9rZW5zXG4gICAgICAgIHtLZXlNZXRhZGF0YX0gPSBhd2FpdCBrbXMuZGVzY3JpYmVLZXkgcGFyYW1zXG4gICAgICAgIEtleU1ldGFkYXRhXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGUsIDQwMCwgXCJOb3RGb3VuZEV4Y2VwdGlvblwiXG5cbiAgICBjcmVhdGUgPSAocGFyYW1zPXt9KSAtPlxuICAgICAge0tleU1ldGFkYXRhfSA9IGF3YWl0IGttcy5jcmVhdGVLZXkgcGFyYW1zXG4gICAgICBLZXlNZXRhZGF0YVxuXG4gICAgc2NoZWR1bGVEZWxldGUgPSAoaWQsIGRlbGF5KSAtPlxuICAgICAgcGFyYW1zID0gS2V5SWQ6IGlkXG4gICAgICBwYXJhbXMuUGVuZGluZ1dpbmRvd0luRGF5cyA9IGRlbGF5IGlmIGRlbGF5XG4gICAgICBhd2FpdCBrbXMuZGVsZXRlS2V5IHBhcmFtc1xuXG4gICAgYWRkQWxpYXMgPSAoVGFyZ2V0S2V5SWQsIEFsaWFzTmFtZSkgLT5cbiAgICAgIGF3YWl0IGttcy5jcmVhdGVBbGlhcyB7VGFyZ2V0S2V5SWQsIEFsaWFzTmFtZX1cblxuICAgIHJlbW92ZUFsaWFzID0gKEFsaWFzTmFtZSkgLT5cbiAgICAgIGF3YWl0IGttcy5kZWxldGVBbGlhcyB7QWxpYXNOYW1lfVxuXG4gICAgcmFuZG9tS2V5ID0gKHNpemUsIGVuY29kaW5nPVwiaGV4XCIpIC0+XG4gICAgICB7UGxhaW50ZXh0fSA9IGF3YWl0IGttcy5nZW5lcmF0ZVJhbmRvbSB7TnVtYmVyT2ZCeXRlczogc2l6ZX1cbiAgICAgIHN3aXRjaCBlbmNvZGluZ1xuICAgICAgICB3aGVuIFwiYnVmZmVyXCJcbiAgICAgICAgICBQbGFpbnRleHRcbiAgICAgICAgd2hlbiBcImFzY2lpXCIsIFwiaGV4XCIsIFwidXRmOFwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCIsIFwiaGV4XCJcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJhc2U2NFwiXG4gICAgICAgICAgIyBPbWl0dGluZyBwYWRkaW5nIGNoYXJhY3RlcnMsIHBlcjpcbiAgICAgICAgICAjIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM0NjQ4I3NlY3Rpb24tMy4yXG4gICAgICAgICAgUGxhaW50ZXh0LnRvU3RyaW5nKFwiYmFzZTY0XCIpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcPSskLywgJycpXG4gICAgICAgIHdoZW4gXCJiYXNlNjRwYWRkZWRcIlxuICAgICAgICAgIFBsYWludGV4dC50b1N0cmluZyhcImJhc2U2NFwiKVxuICAgICAgICB3aGVuIFwiYmFzZTY0dXJsXCJcbiAgICAgICAgICAjIEJhc2VkIG9uIFJGQyA0NjQ4J3MgXCJiYXNlNjR1cmxcIiBtYXBwaW5nOlxuICAgICAgICAgICMgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzQ2NDgjc2VjdGlvbi01XG4gICAgICAgICAgUGxhaW50ZXh0LnRvU3RyaW5nKFwiYmFzZTY0XCIpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcKy9nLCAnLScpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcLy9nLCAnXycpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcPSskLywgJycpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGVuY29kaW5nICN7ZW5jb2Rpbmd9LlwiXG5cbiAgICBlbmNyeXB0ID0gKGlkLCBwbGFpbnRleHQsIGVuY29kaW5nPVwidXRmOFwiLCBvcHRpb25zPXt9KSAtPlxuICAgICAgc3dpdGNoIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJ1dGY4XCIsIFwiYmFzZTY0XCIsIFwiaGV4XCIsIFwiYXNjaWlcIiwgXCJ1dGYxNmxlXCIsIFwidWNzMlwiLCBcImxhdGluMVwiLCBcImJpbmFyeVwiXG4gICAgICAgICAgaW5wdXQgPSBCdWZmZXIuZnJvbSBwbGFpbnRleHQsIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJidWZmZXJcIlxuICAgICAgICAgIGlucHV0ID0gcGxhaW50ZXh0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGVuY29kaW5nICN7ZW5jb2Rpbmd9LlwiXG4gICAgICBwYXJhbXMgPVxuICAgICAgICBLZXlJZDogaWRcbiAgICAgICAgUGxhaW50ZXh0OiBpbnB1dFxuICAgICAgcGFyYW1zID0gbWVyZ2UgcGFyYW1zLCBvcHRpb25zXG4gICAgICB7Q2lwaGVydGV4dEJsb2J9ID0gYXdhaXQga21zLmVuY3J5cHQgcGFyYW1zXG4gICAgICBDaXBoZXJ0ZXh0QmxvYi50b1N0cmluZyhcImJhc2U2NFwiKVxuXG4gICAgZGVjcnlwdCA9IChibG9iLCBlbmNvZGluZz1cInV0ZjhcIiwgb3B0aW9ucz17fSkgLT5cbiAgICAgIHBhcmFtcyA9IENpcGhlcnRleHRCbG9iOiBCdWZmZXIuZnJvbShibG9iLCBcImJhc2U2NFwiKVxuICAgICAgcGFyYW1zID0gbWVyZ2UgcGFyYW1zLCBvcHRpb25zXG4gICAgICB7UGxhaW50ZXh0fSA9IGF3YWl0IGttcy5kZWNyeXB0IHBhcmFtc1xuICAgICAgc3dpdGNoIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJ1dGY4XCIsIFwiYmFzZTY0XCIsIFwiaGV4XCIsIFwiYXNjaWlcIiwgXCJ1dGYxNmxlXCIsIFwidWNzMlwiLCBcImxhdGluMVwiLCBcImJpbmFyeVwiXG4gICAgICAgICAgUGxhaW50ZXh0LnRvU3RyaW5nIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJidWZmZXJcIlxuICAgICAgICAgIFBsYWludGV4dFxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVW5rbm93biBlbmNvZGluZyAje2VuY29kaW5nfS5cIlxuXG4gICAgcmVFbmNyeXB0ID0gKGlkLCBibG9iLCBvcHRpb25zPXt9KSAtPlxuICAgICAgcGFyYW1zID1cbiAgICAgICAgRGVzdGluYXRpb25LZXlJZDogaWRcbiAgICAgICAgQ3lwaGVydGV4dEJsb2I6IEJ1ZmZlci5mcm9tKGJsb2IsIFwiYmFzZTY0XCIpXG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtDaXBoZXJ0ZXh0QmxvYn0gPSBhd2FpdCBrbXMucmVFbmNyeXB0IHBhcmFtc1xuICAgICAgQ2lwaGVydGV4dEJsb2IudG9TdHJpbmcoXCJiYXNlNjRcIilcblxuXG4gICAge2dldCwgY3JlYXRlLCBzY2hlZHVsZURlbGV0ZSwgYWRkQWxpYXMsIHJlbW92ZUFsaWFzLCByYW5kb21LZXksIGRlY3J5cHQsIGVuY3J5cHQsIHJlRW5jcnlwdH1cblxuXG5leHBvcnQgZGVmYXVsdCBjb2duaXRvUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=primitives/kms.coffee