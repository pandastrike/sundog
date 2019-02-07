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

cognitoPrimitive = function (SDK) {
  return function (configuration) {
    var addAlias, create, decrypt, encrypt, get, kms, randomBytes, reEncrypt, removeAlias, scheduleDelete;
    kms = (0, _lift.applyConfiguration)(configuration, SDK.KMS);

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

      return await kms.deleteKey(params);
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
      randomKey,
      decrypt,
      encrypt,
      reEncrypt
    };
  };
};

var _default = cognitoPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMva21zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBR0E7O0FBQ0E7O0FBQ0E7O0FBTEE7O0FBQUEsSUFBQSxnQkFBQTs7QUFPQSxnQkFBQSxHQUFtQixVQUFBLEdBQUEsRUFBQTtTQUNqQixVQUFBLGFBQUEsRUFBQTtBQUNFLFFBQUEsUUFBQSxFQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsT0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsV0FBQSxFQUFBLFNBQUEsRUFBQSxXQUFBLEVBQUEsY0FBQTtBQUFBLElBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyxHQUFBLENBQU47O0FBRUEsSUFBQSxHQUFBLEdBQU0sZ0JBQUEsRUFBQSxFQUFBLE1BQUEsRUFBQTtBQUNKLFVBQUEsV0FBQSxFQUFBLENBQUEsRUFBQSxNQUFBOztBQUFBLFVBQUE7QUFDRSxRQUFBLE1BQUEsR0FBUztBQUFDLFVBQUEsS0FBQSxFQUFPO0FBQVIsU0FBVDs7QUFDQSxZQUFBLE1BQUEsRUFBQTtBQUFBLFVBQUEsTUFBTSxDQUFOLFdBQUEsR0FBQSxNQUFBOzs7QUFDQSxTQUFBO0FBQUEsVUFBQTtBQUFBLFlBQWdCLE1BQU0sR0FBRyxDQUFILFdBQUEsQ0FBdEIsTUFBc0IsQ0FBdEI7ZUFIRixXO0FBQUEsT0FBQSxDQUFBLE9BQUEsS0FBQSxFQUFBO0FBS00sUUFBQSxDQUFBLEdBQUEsS0FBQTtlQUNKLDRCQUFBLENBQUEsRUFBQSxHQUFBLEVBTkYsbUJBTUUsQzs7QUFQRSxLQUFOOztBQVNBLElBQUEsTUFBQSxHQUFTLGdCQUFDLE1BQUEsR0FBRCxFQUFBLEVBQUE7QUFDUCxVQUFBLFdBQUE7QUFBQSxPQUFBO0FBQUEsUUFBQTtBQUFBLFVBQWdCLE1BQU0sR0FBRyxDQUFILFNBQUEsQ0FBdEIsTUFBc0IsQ0FBdEI7YUFDQSxXO0FBRk8sS0FBVDs7QUFJ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YUFBQSxRQUFBO2lCQUlJLFM7O0FBSko7QUFNSSxnQkFBTSxJQUFBLEtBQUEsQ0FBVSxvQkFBQSxRQUFWLEdBQUEsQ0FBTjtBQU5KO0FBSlEsS0FBVjs7QUFZQSxJQUFBLFNBQUEsR0FBWSxnQkFBQSxFQUFBLEVBQUEsSUFBQSxFQUFXLE9BQUEsR0FBWCxFQUFBLEVBQUE7QUFDVixVQUFBLGNBQUEsRUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQ0U7QUFBQSxRQUFBLGdCQUFBLEVBQUEsRUFBQTtBQUNBLFFBQUEsY0FBQSxFQUFnQixNQUFNLENBQU4sSUFBQSxDQUFBLElBQUEsRUFBQSxRQUFBO0FBRGhCLE9BREY7QUFHQSxNQUFBLE1BQUEsR0FBUywyQkFBQSxNQUFBLEVBQUEsT0FBQSxDQUFUO0FBQ0EsT0FBQTtBQUFBLFFBQUE7QUFBQSxVQUFtQixNQUFNLEdBQUcsQ0FBSCxTQUFBLENBQXpCLE1BQXlCLENBQXpCO2FBQ0EsY0FBYyxDQUFkLFFBQUEsQ0FBQSxRQUFBLEM7QUFOVSxLQUFaOztXQVNBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBO0FBQUEsTUFBQSxjQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxTQUFBO0FBQUEsTUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBO0FBQUEsTUFBQTtBQUFBLEs7QUFuRUYsRztBQURpQixDQUFuQjs7ZUF1RWUsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIEtNUy5cbiMgTk9URTogSW4gS01TIG1ldGhvZHMgYmVzaWRlcyBcImNyZWF0ZVwiIGFuZCBcImRlbGV0ZVwiIGFuZCBcImFkZEFsaWFzXCI6IElEIGNhbiBiZSBrZXkgSUQsIGtleSBBUk4sIG9yIGtleSBhbGlhcyBuYW1lLlxuXG5pbXBvcnQge2NhdCwgbWVyZ2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHtub3RGb3VuZH0gZnJvbSBcIi4vcHJpdmF0ZS11dGlsc1wiXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5jb2duaXRvUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAga21zID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5LTVNcblxuICAgIGdldCA9IChpZCwgdG9rZW5zKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHBhcmFtcyA9IHtLZXlJZDogaWR9XG4gICAgICAgIHBhcmFtcy5HcmFudFRva2VucyA9IHRva2VucyBpZiB0b2tlbnNcbiAgICAgICAge0tleU1ldGFkYXRhfSA9IGF3YWl0IGttcy5kZXNjcmliZUtleSBwYXJhbXNcbiAgICAgICAgS2V5TWV0YWRhdGFcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZSwgNDAwLCBcIk5vdEZvdW5kRXhjZXB0aW9uXCJcblxuICAgIGNyZWF0ZSA9IChwYXJhbXM9e30pIC0+XG4gICAgICB7S2V5TWV0YWRhdGF9ID0gYXdhaXQga21zLmNyZWF0ZUtleSBwYXJhbXNcbiAgICAgIEtleU1ldGFkYXRhXG5cbiAgICBzY2hlZHVsZURlbGV0ZSA9IChpZCwgZGVsYXkpIC0+XG4gICAgICBwYXJhbXMgPSBLZXlJZDogaWRcbiAgICAgIHBhcmFtcy5QZW5kaW5nV2luZG93SW5EYXlzID0gZGVsYXkgaWYgZGVsYXlcbiAgICAgIGF3YWl0IGttcy5kZWxldGVLZXkgcGFyYW1zXG5cbiAgICBhZGRBbGlhcyA9IChUYXJnZXRLZXlJZCwgQWxpYXNOYW1lKSAtPlxuICAgICAgYXdhaXQga21zLmNyZWF0ZUFsaWFzIHtUYXJnZXRLZXlJZCwgQWxpYXNOYW1lfVxuXG4gICAgcmVtb3ZlQWxpYXMgPSAoQWxpYXNOYW1lKSAtPlxuICAgICAgYXdhaXQga21zLmRlbGV0ZUFsaWFzIHtBbGlhc05hbWV9XG5cbiAgICByYW5kb21CeXRlcyA9IChzaXplKSAtPlxuICAgICAge1BsYWludGV4dH0gPSBhd2FpdCBrbXMuZ2VuZXJhdGVSYW5kb20ge051bWJlck9mQnl0ZXM6IHNpemV9XG4gICAgICBuZXcgVWludDhBcnJheSBQbGFpbnRleHRcblxuICAgIGVuY3J5cHQgPSAoaWQsIHBsYWludGV4dCwgZW5jb2Rpbmc9XCJ1dGY4XCIsIG9wdGlvbnM9e30pIC0+XG4gICAgICBzd2l0Y2ggZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcInV0ZjhcIiwgXCJiYXNlNjRcIiwgXCJoZXhcIiwgXCJhc2NpaVwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCJcbiAgICAgICAgICBpbnB1dCA9IEJ1ZmZlci5mcm9tIHBsYWludGV4dCwgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJ1ZmZlclwiXG4gICAgICAgICAgaW5wdXQgPSBwbGFpbnRleHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVua25vd24gZW5jb2RpbmcgI3tlbmNvZGluZ30uXCJcbiAgICAgIHBhcmFtcyA9XG4gICAgICAgIEtleUlkOiBpZFxuICAgICAgICBQbGFpbnRleHQ6IGlucHV0XG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtDaXBoZXJ0ZXh0QmxvYn0gPSBhd2FpdCBrbXMuZW5jcnlwdCBwYXJhbXNcbiAgICAgIENpcGhlcnRleHRCbG9iLnRvU3RyaW5nKFwiYmFzZTY0XCIpXG5cbiAgICBkZWNyeXB0ID0gKGJsb2IsIGVuY29kaW5nPVwidXRmOFwiLCBvcHRpb25zPXt9KSAtPlxuICAgICAgcGFyYW1zID0gQ2lwaGVydGV4dEJsb2I6IEJ1ZmZlci5mcm9tKGJsb2IsIFwiYmFzZTY0XCIpXG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtQbGFpbnRleHR9ID0gYXdhaXQga21zLmRlY3J5cHQgcGFyYW1zXG4gICAgICBzd2l0Y2ggZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcInV0ZjhcIiwgXCJiYXNlNjRcIiwgXCJoZXhcIiwgXCJhc2NpaVwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCJcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJ1ZmZlclwiXG4gICAgICAgICAgUGxhaW50ZXh0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGVuY29kaW5nICN7ZW5jb2Rpbmd9LlwiXG5cbiAgICByZUVuY3J5cHQgPSAoaWQsIGJsb2IsIG9wdGlvbnM9e30pIC0+XG4gICAgICBwYXJhbXMgPVxuICAgICAgICBEZXN0aW5hdGlvbktleUlkOiBpZFxuICAgICAgICBDeXBoZXJ0ZXh0QmxvYjogQnVmZmVyLmZyb20oYmxvYiwgXCJiYXNlNjRcIilcbiAgICAgIHBhcmFtcyA9IG1lcmdlIHBhcmFtcywgb3B0aW9uc1xuICAgICAge0NpcGhlcnRleHRCbG9ifSA9IGF3YWl0IGttcy5yZUVuY3J5cHQgcGFyYW1zXG4gICAgICBDaXBoZXJ0ZXh0QmxvYi50b1N0cmluZyhcImJhc2U2NFwiKVxuXG5cbiAgICB7Z2V0LCBjcmVhdGUsIHNjaGVkdWxlRGVsZXRlLCBhZGRBbGlhcywgcmVtb3ZlQWxpYXMsIHJhbmRvbUtleSwgZGVjcnlwdCwgZW5jcnlwdCwgcmVFbmNyeXB0fVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNvZ25pdG9QcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sundog/src/primitives/kms.coffee