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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL2ttcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOztBQUNBOztBQUxBOztBQUFBLElBQUEsZ0JBQUE7O0FBT0EsZ0JBQUEsR0FBbUIsVUFBQSxHQUFBLEVBQUE7U0FDakIsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBLGNBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSw4QkFBQSxhQUFBLEVBQWtDLEdBQUcsQ0FBckMsR0FBQSxDQUFOOztBQUVBLElBQUEsR0FBQSxHQUFNLGdCQUFBLEVBQUEsRUFBQSxNQUFBLEVBQUE7QUFDSixVQUFBLFdBQUEsRUFBQSxDQUFBLEVBQUEsTUFBQTs7QUFBQSxVQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVM7QUFBQyxVQUFBLEtBQUEsRUFBTztBQUFSLFNBQVQ7O0FBQ0EsWUFBQSxNQUFBLEVBQUE7QUFBQSxVQUFBLE1BQU0sQ0FBTixXQUFBLEdBQUEsTUFBQTs7O0FBQ0EsU0FBQTtBQUFBLFVBQUE7QUFBQSxZQUFnQixNQUFNLEdBQUcsQ0FBSCxXQUFBLENBQXRCLE1BQXNCLENBQXRCO2VBSEYsVztBQUFBLE9BQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUtNLFFBQUEsQ0FBQSxHQUFBLEtBQUE7ZUFDSixxQkFBQSxDQUFBLEVBQUEsR0FBQSxFQU5GLG1CQU1FLEM7O0FBUEUsS0FBTjs7QUFTQSxJQUFBLE1BQUEsR0FBUyxnQkFBQyxNQUFBLEdBQUQsRUFBQSxFQUFBO0FBQ1AsVUFBQSxXQUFBO0FBQUEsT0FBQTtBQUFBLFFBQUE7QUFBQSxVQUFnQixNQUFNLEdBQUcsQ0FBSCxTQUFBLENBQXRCLE1BQXNCLENBQXRCO2FBQ0EsVztBQUZPLEtB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QUcsQ0FBSCxTQUFBLENBQXpCLE1BQXlCLENBQXpCO2FBQ0EsY0FBYyxDQUFkLFFBQUEsQ0FBQSxRQUFBLEM7QUFOVSxLQUFaOztXQVNBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBO0FBQUEsTUFBQSxjQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxTQUFBO0FBQUEsTUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBO0FBQUEsTUFBQTtBQUFBLEs7QUF2RkYsRztBQURpQixDQUFuQjs7ZUEyRmUsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIEtNUy5cbiMgTk9URTogSW4gS01TIG1ldGhvZHMgYmVzaWRlcyBcImNyZWF0ZVwiIGFuZCBcImRlbGV0ZVwiIGFuZCBcImFkZEFsaWFzXCI6IElEIGNhbiBiZSBrZXkgSUQsIGtleSBBUk4sIG9yIGtleSBhbGlhcyBuYW1lLlxuXG5pbXBvcnQge2NhdCwgbWVyZ2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHtub3RGb3VuZH0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxuY29nbml0b1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIGttcyA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuS01TXG5cbiAgICBnZXQgPSAoaWQsIHRva2VucykgLT5cbiAgICAgIHRyeVxuICAgICAgICBwYXJhbXMgPSB7S2V5SWQ6IGlkfVxuICAgICAgICBwYXJhbXMuR3JhbnRUb2tlbnMgPSB0b2tlbnMgaWYgdG9rZW5zXG4gICAgICAgIHtLZXlNZXRhZGF0YX0gPSBhd2FpdCBrbXMuZGVzY3JpYmVLZXkgcGFyYW1zXG4gICAgICAgIEtleU1ldGFkYXRhXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGUsIDQwMCwgXCJOb3RGb3VuZEV4Y2VwdGlvblwiXG5cbiAgICBjcmVhdGUgPSAocGFyYW1zPXt9KSAtPlxuICAgICAge0tleU1ldGFkYXRhfSA9IGF3YWl0IGttcy5jcmVhdGVLZXkgcGFyYW1zXG4gICAgICBLZXlNZXRhZGF0YVxuXG4gICAgc2NoZWR1bGVEZWxldGUgPSAoaWQsIGRlbGF5KSAtPlxuICAgICAgcGFyYW1zID0gS2V5SWQ6IGlkXG4gICAgICBwYXJhbXMuUGVuZGluZ1dpbmRvd0luRGF5cyA9IGRlbGF5IGlmIGRlbGF5XG4gICAgICBhd2FpdCBrbXMuZGVsZXRlS2V5IHBhcmFtc1xuXG4gICAgYWRkQWxpYXMgPSAoVGFyZ2V0S2V5SWQsIEFsaWFzTmFtZSkgLT5cbiAgICAgIGF3YWl0IGttcy5jcmVhdGVBbGlhcyB7VGFyZ2V0S2V5SWQsIEFsaWFzTmFtZX1cblxuICAgIHJlbW92ZUFsaWFzID0gKEFsaWFzTmFtZSkgLT5cbiAgICAgIGF3YWl0IGttcy5kZWxldGVBbGlhcyB7QWxpYXNOYW1lfVxuXG4gICAgcmFuZG9tS2V5ID0gKHNpemUsIGVuY29kaW5nPVwiaGV4XCIpIC0+XG4gICAgICB7UGxhaW50ZXh0fSA9IGF3YWl0IGttcy5nZW5lcmF0ZVJhbmRvbSB7TnVtYmVyT2ZCeXRlczogc2l6ZX1cbiAgICAgIHN3aXRjaCBlbmNvZGluZ1xuICAgICAgICB3aGVuIFwiYnVmZmVyXCJcbiAgICAgICAgICBQbGFpbnRleHRcbiAgICAgICAgd2hlbiBcImFzY2lpXCIsIFwiaGV4XCIsIFwidXRmOFwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCIsIFwiaGV4XCJcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJhc2U2NFwiXG4gICAgICAgICAgIyBPbWl0dGluZyBwYWRkaW5nIGNoYXJhY3RlcnMsIHBlcjpcbiAgICAgICAgICAjIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM0NjQ4I3NlY3Rpb24tMy4yXG4gICAgICAgICAgUGxhaW50ZXh0LnRvU3RyaW5nKFwiYmFzZTY0XCIpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcPSskLywgJycpXG4gICAgICAgIHdoZW4gXCJiYXNlNjRwYWRkZWRcIlxuICAgICAgICAgIFBsYWludGV4dC50b1N0cmluZyhcImJhc2U2NFwiKVxuICAgICAgICB3aGVuIFwiYmFzZTY0dXJsXCJcbiAgICAgICAgICAjIEJhc2VkIG9uIFJGQyA0NjQ4J3MgXCJiYXNlNjR1cmxcIiBtYXBwaW5nOlxuICAgICAgICAgICMgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzQ2NDgjc2VjdGlvbi01XG4gICAgICAgICAgUGxhaW50ZXh0LnRvU3RyaW5nKFwiYmFzZTY0XCIpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcKy9nLCAnLScpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcLy9nLCAnXycpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcPSskLywgJycpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGVuY29kaW5nICN7ZW5jb2Rpbmd9LlwiXG5cbiAgICBlbmNyeXB0ID0gKGlkLCBwbGFpbnRleHQsIGVuY29kaW5nPVwidXRmOFwiLCBvcHRpb25zPXt9KSAtPlxuICAgICAgc3dpdGNoIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJ1dGY4XCIsIFwiYmFzZTY0XCIsIFwiaGV4XCIsIFwiYXNjaWlcIiwgXCJ1dGYxNmxlXCIsIFwidWNzMlwiLCBcImxhdGluMVwiLCBcImJpbmFyeVwiXG4gICAgICAgICAgaW5wdXQgPSBCdWZmZXIuZnJvbSBwbGFpbnRleHQsIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJidWZmZXJcIlxuICAgICAgICAgIGlucHV0ID0gcGxhaW50ZXh0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGVuY29kaW5nICN7ZW5jb2Rpbmd9LlwiXG4gICAgICBwYXJhbXMgPVxuICAgICAgICBLZXlJZDogaWRcbiAgICAgICAgUGxhaW50ZXh0OiBpbnB1dFxuICAgICAgcGFyYW1zID0gbWVyZ2UgcGFyYW1zLCBvcHRpb25zXG4gICAgICB7Q2lwaGVydGV4dEJsb2J9ID0gYXdhaXQga21zLmVuY3J5cHQgcGFyYW1zXG4gICAgICBDaXBoZXJ0ZXh0QmxvYi50b1N0cmluZyhcImJhc2U2NFwiKVxuXG4gICAgZGVjcnlwdCA9IChibG9iLCBlbmNvZGluZz1cInV0ZjhcIiwgb3B0aW9ucz17fSkgLT5cbiAgICAgIHBhcmFtcyA9IENpcGhlcnRleHRCbG9iOiBCdWZmZXIuZnJvbShibG9iLCBcImJhc2U2NFwiKVxuICAgICAgcGFyYW1zID0gbWVyZ2UgcGFyYW1zLCBvcHRpb25zXG4gICAgICB7UGxhaW50ZXh0fSA9IGF3YWl0IGttcy5kZWNyeXB0IHBhcmFtc1xuICAgICAgc3dpdGNoIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJ1dGY4XCIsIFwiYmFzZTY0XCIsIFwiaGV4XCIsIFwiYXNjaWlcIiwgXCJ1dGYxNmxlXCIsIFwidWNzMlwiLCBcImxhdGluMVwiLCBcImJpbmFyeVwiXG4gICAgICAgICAgUGxhaW50ZXh0LnRvU3RyaW5nIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJidWZmZXJcIlxuICAgICAgICAgIFBsYWludGV4dFxuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yIFwiVW5rbm93biBlbmNvZGluZyAje2VuY29kaW5nfS5cIlxuXG4gICAgcmVFbmNyeXB0ID0gKGlkLCBibG9iLCBvcHRpb25zPXt9KSAtPlxuICAgICAgcGFyYW1zID1cbiAgICAgICAgRGVzdGluYXRpb25LZXlJZDogaWRcbiAgICAgICAgQ3lwaGVydGV4dEJsb2I6IEJ1ZmZlci5mcm9tKGJsb2IsIFwiYmFzZTY0XCIpXG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtDaXBoZXJ0ZXh0QmxvYn0gPSBhd2FpdCBrbXMucmVFbmNyeXB0IHBhcmFtc1xuICAgICAgQ2lwaGVydGV4dEJsb2IudG9TdHJpbmcoXCJiYXNlNjRcIilcblxuXG4gICAge2dldCwgY3JlYXRlLCBzY2hlZHVsZURlbGV0ZSwgYWRkQWxpYXMsIHJlbW92ZUFsaWFzLCByYW5kb21LZXksIGRlY3J5cHQsIGVuY3J5cHQsIHJlRW5jcnlwdH1cblxuXG5leHBvcnQgZGVmYXVsdCBjb2duaXRvUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/kms.coffee