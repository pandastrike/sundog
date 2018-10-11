"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _utils = require("./utils");

var _lift = require("../lift");

// Primitives for the service KMS.
// NOTE: In KMS methods besides "create" and "delete" and "addAlias": ID can be key ID, key ARN, or key alias name.
var cognitoPrimitive;

cognitoPrimitive = function (SDK) {
  return function (configuration) {
    var addAlias, create, decrypt, encrypt, get, kms, randomKey, reEncrypt, removeAlias, scheduleDelete;
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
        return (0, _utils.notFound)(e, 400, "NotFoundException");
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

    randomKey = async function (size, encoding = "hex") {
      var Plaintext;
      ({
        Plaintext
      } = await kms.generateRandom({
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
//# sourceMappingURL=data:application/json;base64,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QUFjLENBQWQsUUFBQSxDQUFBLFFBQUEsQztBQU5VLEtBQVo7O1dBU0E7QUFBQSxNQUFBLEdBQUE7QUFBQSxNQUFBLE1BQUE7QUFBQSxNQUFBLGNBQUE7QUFBQSxNQUFBLFFBQUE7QUFBQSxNQUFBLFdBQUE7QUFBQSxNQUFBLFNBQUE7QUFBQSxNQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUE7QUFBQSxNQUFBO0FBQUEsSztBQXZGRixHO0FBRGlCLENBQW5COztlQTJGZSxnQiIsInNvdXJjZXNDb250ZW50IjpbIiMgUHJpbWl0aXZlcyBmb3IgdGhlIHNlcnZpY2UgS01TLlxuIyBOT1RFOiBJbiBLTVMgbWV0aG9kcyBiZXNpZGVzIFwiY3JlYXRlXCIgYW5kIFwiZGVsZXRlXCIgYW5kIFwiYWRkQWxpYXNcIjogSUQgY2FuIGJlIGtleSBJRCwga2V5IEFSTiwgb3Iga2V5IGFsaWFzIG5hbWUuXG5cbmltcG9ydCB7Y2F0LCBtZXJnZX0gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQge25vdEZvdW5kfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5jb2duaXRvUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAga21zID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5LTVNcblxuICAgIGdldCA9IChpZCwgdG9rZW5zKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHBhcmFtcyA9IHtLZXlJZDogaWR9XG4gICAgICAgIHBhcmFtcy5HcmFudFRva2VucyA9IHRva2VucyBpZiB0b2tlbnNcbiAgICAgICAge0tleU1ldGFkYXRhfSA9IGF3YWl0IGttcy5kZXNjcmliZUtleSBwYXJhbXNcbiAgICAgICAgS2V5TWV0YWRhdGFcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZSwgNDAwLCBcIk5vdEZvdW5kRXhjZXB0aW9uXCJcblxuICAgIGNyZWF0ZSA9IChwYXJhbXM9e30pIC0+XG4gICAgICB7S2V5TWV0YWRhdGF9ID0gYXdhaXQga21zLmNyZWF0ZUtleSBwYXJhbXNcbiAgICAgIEtleU1ldGFkYXRhXG5cbiAgICBzY2hlZHVsZURlbGV0ZSA9IChpZCwgZGVsYXkpIC0+XG4gICAgICBwYXJhbXMgPSBLZXlJZDogaWRcbiAgICAgIHBhcmFtcy5QZW5kaW5nV2luZG93SW5EYXlzID0gZGVsYXkgaWYgZGVsYXlcbiAgICAgIGF3YWl0IGttcy5kZWxldGVLZXkgcGFyYW1zXG5cbiAgICBhZGRBbGlhcyA9IChUYXJnZXRLZXlJZCwgQWxpYXNOYW1lKSAtPlxuICAgICAgYXdhaXQga21zLmNyZWF0ZUFsaWFzIHtUYXJnZXRLZXlJZCwgQWxpYXNOYW1lfVxuXG4gICAgcmVtb3ZlQWxpYXMgPSAoQWxpYXNOYW1lKSAtPlxuICAgICAgYXdhaXQga21zLmRlbGV0ZUFsaWFzIHtBbGlhc05hbWV9XG5cbiAgICByYW5kb21LZXkgPSAoc2l6ZSwgZW5jb2Rpbmc9XCJoZXhcIikgLT5cbiAgICAgIHtQbGFpbnRleHR9ID0gYXdhaXQga21zLmdlbmVyYXRlUmFuZG9tIHtOdW1iZXJPZkJ5dGVzOiBzaXplfVxuICAgICAgc3dpdGNoIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJidWZmZXJcIlxuICAgICAgICAgIFBsYWludGV4dFxuICAgICAgICB3aGVuIFwiYXNjaWlcIiwgXCJoZXhcIiwgXCJ1dGY4XCIsIFwidXRmMTZsZVwiLCBcInVjczJcIiwgXCJsYXRpbjFcIiwgXCJiaW5hcnlcIiwgXCJoZXhcIlxuICAgICAgICAgIFBsYWludGV4dC50b1N0cmluZyBlbmNvZGluZ1xuICAgICAgICB3aGVuIFwiYmFzZTY0XCJcbiAgICAgICAgICAjIE9taXR0aW5nIHBhZGRpbmcgY2hhcmFjdGVycywgcGVyOlxuICAgICAgICAgICMgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzQ2NDgjc2VjdGlvbi0zLjJcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcoXCJiYXNlNjRcIilcbiAgICAgICAgICAucmVwbGFjZSgvXFw9KyQvLCAnJylcbiAgICAgICAgd2hlbiBcImJhc2U2NHBhZGRlZFwiXG4gICAgICAgICAgUGxhaW50ZXh0LnRvU3RyaW5nKFwiYmFzZTY0XCIpXG4gICAgICAgIHdoZW4gXCJiYXNlNjR1cmxcIlxuICAgICAgICAgICMgQmFzZWQgb24gUkZDIDQ2NDgncyBcImJhc2U2NHVybFwiIG1hcHBpbmc6XG4gICAgICAgICAgIyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNDY0OCNzZWN0aW9uLTVcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcoXCJiYXNlNjRcIilcbiAgICAgICAgICAucmVwbGFjZSgvXFwrL2csICctJylcbiAgICAgICAgICAucmVwbGFjZSgvXFwvL2csICdfJylcbiAgICAgICAgICAucmVwbGFjZSgvXFw9KyQvLCAnJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVua25vd24gZW5jb2RpbmcgI3tlbmNvZGluZ30uXCJcblxuICAgIGVuY3J5cHQgPSAoaWQsIHBsYWludGV4dCwgZW5jb2Rpbmc9XCJ1dGY4XCIsIG9wdGlvbnM9e30pIC0+XG4gICAgICBzd2l0Y2ggZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcInV0ZjhcIiwgXCJiYXNlNjRcIiwgXCJoZXhcIiwgXCJhc2NpaVwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCJcbiAgICAgICAgICBpbnB1dCA9IEJ1ZmZlci5mcm9tIHBsYWludGV4dCwgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJ1ZmZlclwiXG4gICAgICAgICAgaW5wdXQgPSBwbGFpbnRleHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVua25vd24gZW5jb2RpbmcgI3tlbmNvZGluZ30uXCJcbiAgICAgIHBhcmFtcyA9XG4gICAgICAgIEtleUlkOiBpZFxuICAgICAgICBQbGFpbnRleHQ6IGlucHV0XG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtDaXBoZXJ0ZXh0QmxvYn0gPSBhd2FpdCBrbXMuZW5jcnlwdCBwYXJhbXNcbiAgICAgIENpcGhlcnRleHRCbG9iLnRvU3RyaW5nKFwiYmFzZTY0XCIpXG5cbiAgICBkZWNyeXB0ID0gKGJsb2IsIGVuY29kaW5nPVwidXRmOFwiLCBvcHRpb25zPXt9KSAtPlxuICAgICAgcGFyYW1zID0gQ2lwaGVydGV4dEJsb2I6IEJ1ZmZlci5mcm9tKGJsb2IsIFwiYmFzZTY0XCIpXG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtQbGFpbnRleHR9ID0gYXdhaXQga21zLmRlY3J5cHQgcGFyYW1zXG4gICAgICBzd2l0Y2ggZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcInV0ZjhcIiwgXCJiYXNlNjRcIiwgXCJoZXhcIiwgXCJhc2NpaVwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCJcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJ1ZmZlclwiXG4gICAgICAgICAgUGxhaW50ZXh0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGVuY29kaW5nICN7ZW5jb2Rpbmd9LlwiXG5cbiAgICByZUVuY3J5cHQgPSAoaWQsIGJsb2IsIG9wdGlvbnM9e30pIC0+XG4gICAgICBwYXJhbXMgPVxuICAgICAgICBEZXN0aW5hdGlvbktleUlkOiBpZFxuICAgICAgICBDeXBoZXJ0ZXh0QmxvYjogQnVmZmVyLmZyb20oYmxvYiwgXCJiYXNlNjRcIilcbiAgICAgIHBhcmFtcyA9IG1lcmdlIHBhcmFtcywgb3B0aW9uc1xuICAgICAge0NpcGhlcnRleHRCbG9ifSA9IGF3YWl0IGttcy5yZUVuY3J5cHQgcGFyYW1zXG4gICAgICBDaXBoZXJ0ZXh0QmxvYi50b1N0cmluZyhcImJhc2U2NFwiKVxuXG5cbiAgICB7Z2V0LCBjcmVhdGUsIHNjaGVkdWxlRGVsZXRlLCBhZGRBbGlhcywgcmVtb3ZlQWxpYXMsIHJhbmRvbUtleSwgZGVjcnlwdCwgZW5jcnlwdCwgcmVFbmNyeXB0fVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNvZ25pdG9QcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=primitives/kms.coffee