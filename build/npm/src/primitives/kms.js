"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _privateUtils = require("./private-utils");

var _lift = require("../lift");

// Primitives for the service KMS.
// NOTE: In KMS methods besides "create" and "delete" and "addAlias": ID can be key ID, key ARN, or key alias name.
var cognitoPrimitive;

cognitoPrimitive = function (options) {
  return function (configuration) {
    var addAlias, create, decrypt, encrypt, get, kms, randomBytes, reEncrypt, removeAlias, scheduleDelete;
    kms = (0, _lift.prepareModule)(options, configuration, require("aws-sdk/clients/kms"), ["describeKey", "createKey", "scheduleKeyDeletion", "createAlias", "deleteAlias", "generateRandom", "encrypt", "decrypt", "reEncrypt"]);

    get = async function (id, tokens) {
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
        } = await kms.describeKey(params));
        return KeyMetadata;
      } catch (error) {
        e = error;
        return (0, _privateUtils.notFound)(e, 400, "NotFoundException");
      }
    };

    create = async function (params = {}) {
      var KeyMetadata;
      ({
        KeyMetadata
      } = await kms.createKey(params));
      return KeyMetadata;
    };

    scheduleDelete = async function (id, delay) {
      var params;
      params = {
        KeyId: id
      };

      if (delay) {
        params.PendingWindowInDays = delay;
      }

      return await kms.scheduleKeyDeletion(params);
    };

    addAlias = async function (TargetKeyId, AliasName) {
      return await kms.createAlias({
        TargetKeyId,
        AliasName
      });
    };

    removeAlias = async function (AliasName) {
      return await kms.deleteAlias({
        AliasName
      });
    };

    randomBytes = async function (size) {
      var Plaintext;
      ({
        Plaintext
      } = await kms.generateRandom({
        NumberOfBytes: size
      }));
      return new Uint8Array(Plaintext);
    };

    encrypt = async function (id, plaintext, encoding = "utf8", options = {}) {
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
      params = (0, _pandaParchment.merge)(params, options);
      ({
        CiphertextBlob
      } = await kms.encrypt(params));
      return CiphertextBlob.toString("base64");
    };

    decrypt = async function (blob, encoding = "utf8", options = {}) {
      var Plaintext, params;
      params = {
        CiphertextBlob: Buffer.from(blob, "base64")
      };
      params = (0, _pandaParchment.merge)(params, options);
      ({
        Plaintext
      } = await kms.decrypt(params));

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
    };

    reEncrypt = async function (id, blob, options = {}) {
      var CiphertextBlob, params;
      params = {
        DestinationKeyId: id,
        CyphertextBlob: Buffer.from(blob, "base64")
      };
      params = (0, _pandaParchment.merge)(params, options);
      ({
        CiphertextBlob
      } = await kms.reEncrypt(params));
      return CiphertextBlob.toString("base64");
    };

    return {
      get,
      create,
      scheduleDelete,
      addAlias,
      removeAlias,
      randomBytes,
      decrypt,
      encrypt,
      reEncrypt
    };
  };
};

var _default = cognitoPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMva21zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBTEE7O0FBQUEsSUFBQSxnQkFBQTs7QUFPQSxnQkFBQSxHQUFtQixVQUFBLE9BQUEsRUFBQTtTQUNqQixVQUFBLGFBQUEsRUFBQTtBQUNFLFFBQUEsUUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsV0FBQSxFQUFBLFNBQUEsRUFBQSxXQUFBLEVBQUEsY0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLHlCQUFBLE9BQUEsRUFBQSxhQUFBLEVBQ0osT0FBQSxDQURJLHFCQUNKLENBREksRUFFSixDQUFBLGFBQUEsRUFBQSxXQUFBLEVBQUEscUJBQUEsRUFBQSxhQUFBLEVBQUEsYUFBQSxFQUFBLGdCQUFBLEVBQUEsU0FBQSxFQUFBLFNBQUEsRUFGSSxXQUVKLENBRkksQ0FBTjs7QUFjQSxJQUFBLEdBQUEsR0FBTSxnQkFBQSxFQUFBLEVBQUEsTUFBQSxFQUFBO0FBQ0osVUFBQSxXQUFBLEVBQUEsQ0FBQSxFQUFBLE1BQUE7O0FBQUEsVUFBQTtBQUNFLFFBQUEsTUFBQSxHQUFTO0FBQUMsVUFBQSxLQUFBLEVBQU87QUFBUixTQUFUOztBQUNBLFlBQUEsTUFBQSxFQUFBO0FBQUEsVUFBQSxNQUFNLENBQU4sV0FBQSxHQUFBLE1BQUE7OztBQUNBLFNBQUE7QUFBQSxVQUFBO0FBQUEsWUFBZ0IsTUFBTSxHQUFHLENBQUgsV0FBQSxDQUF0QixNQUFzQixDQUF0QjtlQUhGLFc7QUFBQSxPQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFLTSxRQUFBLENBQUEsR0FBQSxLQUFBO2VBQ0osNEJBQUEsQ0FBQSxFQUFBLEdBQUEsRUFORixtQkFNRSxDOztBQVBFLEtBQU47O0FBU0EsSUFBQSxNQUFBLEdBQVMsZ0JBQUMsTUFBQSxHQUFE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QUE7QUFBQSxhQUFBLE9BQUE7QUFBQSxhQUFBLFNBQUE7QUFBQSxhQUFBLE1BQUE7QUFBQSxhQUFBLFFBQUE7QUFBQSxhQUFBLFFBQUE7aUJBRUksU0FBUyxDQUFULFFBQUEsQ0FBQSxRQUFBLEM7O0FBRkosYUFBQSxRQUFBO2lCQUlJLFM7O0FBSko7QUFNSSxnQkFBTSxJQUFBLEtBQUEsQ0FBVSxvQkFBQSxRQUFWLEdBQUEsQ0FBTjtBQU5KO0FBSlEsS0FBVjs7QUFZQSxJQUFBLFNBQUEsR0FBWSxnQkFBQSxFQUFBLEVBQUEsSUFBQSxFQUFXLE9BQUEsR0FBWCxFQUFBLEVBQUE7QUFDVixVQUFBLGNBQUEsRUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQ0U7QUFBQSxRQUFBLGdCQUFBLEVBQUEsRUFBQTtBQUNBLFFBQUEsY0FBQSxFQUFnQixNQUFNLENBQU4sSUFBQSxDQUFBLElBQUEsRUFBQSxRQUFBO0FBRGhCLE9BREY7QUFHQSxNQUFBLE1BQUEsR0FBUywyQkFBQSxNQUFBLEVBQUEsT0FBQSxDQUFUO0FBQ0EsT0FBQTtBQUFBLFFBQUE7QUFBQSxVQUFtQixNQUFNLEdBQUcsQ0FBSCxTQUFBLENBQXpCLE1BQXlCLENBQXpCO2FBQ0EsY0FBYyxDQUFkLFFBQUEsQ0FBQSxRQUFBLEM7QUFOVSxLQUFaOztXQVNBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBO0FBQUEsTUFBQSxjQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBO0FBQUEsTUFBQTtBQUFBLEs7QUEvRUYsRztBQURpQixDQUFuQjs7ZUFtRmUsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIEtNUy5cbiMgTk9URTogSW4gS01TIG1ldGhvZHMgYmVzaWRlcyBcImNyZWF0ZVwiIGFuZCBcImRlbGV0ZVwiIGFuZCBcImFkZEFsaWFzXCI6IElEIGNhbiBiZSBrZXkgSUQsIGtleSBBUk4sIG9yIGtleSBhbGlhcyBuYW1lLlxuXG5pbXBvcnQge2NhdCwgbWVyZ2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHtub3RGb3VuZH0gZnJvbSBcIi4vcHJpdmF0ZS11dGlsc1wiXG5pbXBvcnQge3ByZXBhcmVNb2R1bGV9IGZyb20gXCIuLi9saWZ0XCJcblxuY29nbml0b1ByaW1pdGl2ZSA9IChvcHRpb25zKSAtPlxuICAoY29uZmlndXJhdGlvbikgLT5cbiAgICBrbXMgPSBwcmVwYXJlTW9kdWxlIG9wdGlvbnMsIGNvbmZpZ3VyYXRpb24sXG4gICAgICByZXF1aXJlKFwiYXdzLXNkay9jbGllbnRzL2ttc1wiKSxcbiAgICAgIFtcbiAgICAgICAgXCJkZXNjcmliZUtleVwiXG4gICAgICAgIFwiY3JlYXRlS2V5XCJcbiAgICAgICAgXCJzY2hlZHVsZUtleURlbGV0aW9uXCJcbiAgICAgICAgXCJjcmVhdGVBbGlhc1wiXG4gICAgICAgIFwiZGVsZXRlQWxpYXNcIlxuICAgICAgICBcImdlbmVyYXRlUmFuZG9tXCJcbiAgICAgICAgXCJlbmNyeXB0XCJcbiAgICAgICAgXCJkZWNyeXB0XCJcbiAgICAgICAgXCJyZUVuY3J5cHRcIlxuICAgICAgXVxuXG4gICAgZ2V0ID0gKGlkLCB0b2tlbnMpIC0+XG4gICAgICB0cnlcbiAgICAgICAgcGFyYW1zID0ge0tleUlkOiBpZH1cbiAgICAgICAgcGFyYW1zLkdyYW50VG9rZW5zID0gdG9rZW5zIGlmIHRva2Vuc1xuICAgICAgICB7S2V5TWV0YWRhdGF9ID0gYXdhaXQga21zLmRlc2NyaWJlS2V5IHBhcmFtc1xuICAgICAgICBLZXlNZXRhZGF0YVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBub3RGb3VuZCBlLCA0MDAsIFwiTm90Rm91bmRFeGNlcHRpb25cIlxuXG4gICAgY3JlYXRlID0gKHBhcmFtcz17fSkgLT5cbiAgICAgIHtLZXlNZXRhZGF0YX0gPSBhd2FpdCBrbXMuY3JlYXRlS2V5IHBhcmFtc1xuICAgICAgS2V5TWV0YWRhdGFcblxuICAgIHNjaGVkdWxlRGVsZXRlID0gKGlkLCBkZWxheSkgLT5cbiAgICAgIHBhcmFtcyA9IEtleUlkOiBpZFxuICAgICAgcGFyYW1zLlBlbmRpbmdXaW5kb3dJbkRheXMgPSBkZWxheSBpZiBkZWxheVxuICAgICAgYXdhaXQga21zLnNjaGVkdWxlS2V5RGVsZXRpb24gcGFyYW1zXG5cbiAgICBhZGRBbGlhcyA9IChUYXJnZXRLZXlJZCwgQWxpYXNOYW1lKSAtPlxuICAgICAgYXdhaXQga21zLmNyZWF0ZUFsaWFzIHtUYXJnZXRLZXlJZCwgQWxpYXNOYW1lfVxuXG4gICAgcmVtb3ZlQWxpYXMgPSAoQWxpYXNOYW1lKSAtPlxuICAgICAgYXdhaXQga21zLmRlbGV0ZUFsaWFzIHtBbGlhc05hbWV9XG5cbiAgICByYW5kb21CeXRlcyA9IChzaXplKSAtPlxuICAgICAge1BsYWludGV4dH0gPSBhd2FpdCBrbXMuZ2VuZXJhdGVSYW5kb20ge051bWJlck9mQnl0ZXM6IHNpemV9XG4gICAgICBuZXcgVWludDhBcnJheSBQbGFpbnRleHRcblxuICAgIGVuY3J5cHQgPSAoaWQsIHBsYWludGV4dCwgZW5jb2Rpbmc9XCJ1dGY4XCIsIG9wdGlvbnM9e30pIC0+XG4gICAgICBzd2l0Y2ggZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcInV0ZjhcIiwgXCJiYXNlNjRcIiwgXCJoZXhcIiwgXCJhc2NpaVwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCJcbiAgICAgICAgICBpbnB1dCA9IEJ1ZmZlci5mcm9tIHBsYWludGV4dCwgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJ1ZmZlclwiXG4gICAgICAgICAgaW5wdXQgPSBwbGFpbnRleHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVua25vd24gZW5jb2RpbmcgI3tlbmNvZGluZ30uXCJcbiAgICAgIHBhcmFtcyA9XG4gICAgICAgIEtleUlkOiBpZFxuICAgICAgICBQbGFpbnRleHQ6IGlucHV0XG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtDaXBoZXJ0ZXh0QmxvYn0gPSBhd2FpdCBrbXMuZW5jcnlwdCBwYXJhbXNcbiAgICAgIENpcGhlcnRleHRCbG9iLnRvU3RyaW5nKFwiYmFzZTY0XCIpXG5cbiAgICBkZWNyeXB0ID0gKGJsb2IsIGVuY29kaW5nPVwidXRmOFwiLCBvcHRpb25zPXt9KSAtPlxuICAgICAgcGFyYW1zID0gQ2lwaGVydGV4dEJsb2I6IEJ1ZmZlci5mcm9tKGJsb2IsIFwiYmFzZTY0XCIpXG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtQbGFpbnRleHR9ID0gYXdhaXQga21zLmRlY3J5cHQgcGFyYW1zXG4gICAgICBzd2l0Y2ggZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcInV0ZjhcIiwgXCJiYXNlNjRcIiwgXCJoZXhcIiwgXCJhc2NpaVwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCJcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJ1ZmZlclwiXG4gICAgICAgICAgUGxhaW50ZXh0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGVuY29kaW5nICN7ZW5jb2Rpbmd9LlwiXG5cbiAgICByZUVuY3J5cHQgPSAoaWQsIGJsb2IsIG9wdGlvbnM9e30pIC0+XG4gICAgICBwYXJhbXMgPVxuICAgICAgICBEZXN0aW5hdGlvbktleUlkOiBpZFxuICAgICAgICBDeXBoZXJ0ZXh0QmxvYjogQnVmZmVyLmZyb20oYmxvYiwgXCJiYXNlNjRcIilcbiAgICAgIHBhcmFtcyA9IG1lcmdlIHBhcmFtcywgb3B0aW9uc1xuICAgICAge0NpcGhlcnRleHRCbG9ifSA9IGF3YWl0IGttcy5yZUVuY3J5cHQgcGFyYW1zXG4gICAgICBDaXBoZXJ0ZXh0QmxvYi50b1N0cmluZyhcImJhc2U2NFwiKVxuXG5cbiAgICB7Z2V0LCBjcmVhdGUsIHNjaGVkdWxlRGVsZXRlLCBhZGRBbGlhcywgcmVtb3ZlQWxpYXMsIHJhbmRvbUJ5dGVzLCBkZWNyeXB0LCBlbmNyeXB0LCByZUVuY3J5cHR9XG5cblxuZXhwb3J0IGRlZmF1bHQgY29nbml0b1ByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sundog/src/primitives/kms.coffee