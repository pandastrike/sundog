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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL2ttcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOztBQUNBOztBQUxBOztBQUFBLElBQUEsZ0JBQUE7O0FBT0EsZ0JBQUEsR0FBbUIsVUFBQSxHQUFBLEVBQUE7U0FDakIsVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLFFBQUEsRUFBQSxNQUFBLEVBQUEsT0FBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsV0FBQSxFQUFBLGNBQUE7QUFBQSxJQUFBLEdBQUEsR0FBTSw4QkFBQSxhQUFBLEVBQWtDLEdBQUcsQ0FBckMsR0FBQSxDQUFOOztBQUVBLElBQUEsR0FBQSxHQUFNLGdCQUFBLEVBQUEsRUFBQSxNQUFBLEVBQUE7QUFDSixVQUFBLFdBQUEsRUFBQSxDQUFBLEVBQUEsTUFBQTs7QUFBQSxVQUFBO0FBQ0UsUUFBQSxNQUFBLEdBQVM7QUFBQyxVQUFBLEtBQUEsRUFBTztBQUFSLFNBQVQ7O0FBQ0EsWUFBQSxNQUFBLEVBQUE7QUFBQSxVQUFBLE1BQU0sQ0FBTixXQUFBLEdBQUEsTUFBQTs7O0FBQ0EsU0FBQTtBQUFBLFVBQUE7QUFBQSxZQUFnQixNQUFNLEdBQUcsQ0FBSCxXQUFBLENBQXRCLE1BQXNCLENBQXRCO2VBSEYsVztBQUFBLE9BQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUtNLFFBQUEsQ0FBQSxHQUFBLEtBQUE7ZUFDSiw0QkFBQSxDQUFBLEVBQUEsR0FBQSxFQU5GLG1CQU1FLEM7O0FBUEUsS0FBTjs7QUFTQSxJQUFBLE1BQUEsR0FBUyxnQkFBQyxNQUFBLEdBQUQsRUFBQSxFQUFBO0FBQ1AsVUFBQSxXQUFBO0FBQUEsT0FBQTtBQUFBLFFBQUE7QUFBQSxVQUFnQixNQUFNLEdBQUcsQ0FBSCxTQUFBLENBQXRCLE1BQXNCLENBQXRCO2FBQ0EsVztBQUZPLEtBQVQ7O0FBSUEsSUFBQSxjQUFBLEdBQWlCLGdCQUFBLEVBQUEsRUFBQSxLQUFBLEVBQUE7QUFDZixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUztBQUFBLFFBQUEsS0FBQSxFQUFPO0FBQVAsT0FBVDs7QUFDQSxVQUFBLEtBQUEsRUFBQTtBQUFBLFFBQUEsTUFBTSxDQUFOLG1CQUFBLEdBQUEsS0FBQTs7O0FBQ0EsYUFBQSxNQUFNLEdBQUcsQ0FBSCxTQUFBLENBQU4sTUFBTSxDQUFOO0FBSGUsS0FBakI7O0FBS0EsSUFBQSxRQUFBLEdBQVcsZ0JBQUEsV0FBQSxFQUFBLFNBQUEsRUFBQTtBQUNULGFBQUEsTUFBTSxHQUFHLENBQUgsV0FBQSxDQUFnQjtBQUFBLFFBQUEsV0FBQTtBQUF0QixRQUFBO0FBQXNCLE9BQWhCLENBQU47QUFEUyxLQUFYOztBQUdBLElBQUEsV0FBQSxHQUFjLGdCQUFBLFNBQUEsRUFBQTtBQUNaLGFBQUEsTUFBTSxHQUFHLENBQUgsV0FBQSxDQUFnQjtBQUF0QixRQUFBO0FBQXNCLE9BQWhCLENBQU47QUFEWSxLQUFkOztBQUdBLElBQUEsU0FBQSxHQUFZLGdCQUFBLElBQUEsRUFBTyxRQUFBLEdBQVAsS0FBQSxFQUFBO0FBQ1YsVUFBQSxTQUFBO0FBQUEsT0FBQTtBQUFBLFFBQUE7QUFBQSxVQUFjLE1BQU0sR0FBRyxDQUFILGNBQUEsQ0FBbUI7QUFBQyxRQUFBLGFBQUEsRUFBZTtBQUFoQixPQUFuQixDQUFwQjs7QUFDQSxjQUFBLFFBQUE7QUFBQSxhQUFBLFFBQUE7aUJBRUksUzs7QUFGSixhQUFBLE9BQUE7QUFBQSxhQUFBLEtBQUE7QUFBQSxhQUFBLE1BQUE7QUFBQSxhQUFBLFNBQUE7QUFBQSxhQUFBLE1BQUE7QUFBQSxhQUFBLFFBQUE7QUFBQSxhQUFBLFFBQUE7QUFBQSxhQUFBLEtBQUE7aUJBSUksU0FBUyxDQUFULFFBQUEsQ0FBQSxRQUFBLEM7O0FBSkosYUFBQSxRQUFBOzs7aUJBUUksU0FBUyxDQUFULFFBQUEsQ0FBQSxRQUFBLEVBQUEsT0FBQSxDQUFBLE1BQUEsRUFBQSxFQUFBLEM7O0FBUkosYUFBQSxjQUFBO2lCQVdJLFNBQVMsQ0FBVCxRQUFBLENBQUEsUUFBQSxDOztBQVhKLGFBQUEsV0FBQTs7O2lCQWVJLFNBQVMsQ0FBVCxRQUFBLENBQUEsUUFBQSxFQUFBLE9BQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsQ0FBQSxNQUFBLEVBQUEsRUFBQSxDOztBQWZKO0FBb0JJLGdCQUFNLElBQUEsS0FBQSxDQUFVLG9CQUFBLFFBQVYsR0FBQSxDQUFOO0FBcEJKO0FBRlUsS0FBWjs7QUF3QkEsSUFBQSxPQUFBLEdBQVUsZ0JBQUEsRUFBQSxFQUFBLFNBQUEsRUFBZ0IsUUFBQSxHQUFoQixNQUFBLEVBQWlDLE9BQUEsR0FBakMsRUFBQSxFQUFBO0FBQ1IsVUFBQSxjQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUE7O0FBQUEsY0FBQSxRQUFBO0FBQUEsYUFBQSxNQUFBO0FBQUEsYUFBQSxRQUFBO0FBQUEsYUFBQSxLQUFBO0FBQUEsYUFBQSxPQUFBO0FBQUEsYUFBQSxTQUFBO0FBQUEsYUFBQSxNQUFBO0FBQUEsYUFBQSxRQUFBO0FBQUEsYUFBQSxRQUFBO0FBRUksVUFBQSxLQUFBLEdBQVEsTUFBTSxDQUFOLElBQUEsQ0FBQSxTQUFBLEVBQUEsUUFBQSxDQUFSO0FBRGtFOztBQUR0RSxhQUFBLFFBQUE7QUFJSSxVQUFBLEtBQUEsR0FBUSxTQUFSO0FBREc7O0FBSFA7QUFNSSxnQkFBTSxJQUFBLEtBQUEsQ0FBVSxvQkFBQSxRQUFWLEdBQUEsQ0FBTjtBQU5KOztBQU9BLE1BQUEsTUFBQSxHQUNFO0FBQUEsUUFBQSxLQUFBLEVBQUEsRUFBQTtBQUNBLFFBQUEsU0FBQSxFQUFXO0FBRFgsT0FERjtBQUdBLE1BQUEsTUFBQSxHQUFTLDJCQUFBLE1BQUEsRUFBQSxPQUFBLENBQVQ7QUFDQSxPQUFBO0FBQUEsUUFBQTtBQUFBLFVBQW1CLE1BQU0sR0FBRyxDQUFILE9BQUEsQ0FBekIsTUFBeUIsQ0FBekI7YUFDQSxjQUFjLENBQWQsUUFBQSxDQUFBLFFBQUEsQztBQWJRLEtBQVY7O0FBZUEsSUFBQSxPQUFBLEdBQVUsZ0JBQUEsSUFBQSxFQUFPLFFBQUEsR0FBUCxNQUFBLEVBQXdCLE9BQUEsR0FBeEIsRUFBQSxFQUFBO0FBQ1IsVUFBQSxTQUFBLEVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTO0FBQUEsUUFBQSxjQUFBLEVBQWdCLE1BQU0sQ0FBTixJQUFBLENBQUEsSUFBQSxFQUFBLFFBQUE7QUFBaEIsT0FBVDtBQUNBLE1BQUEsTUFBQSxHQUFTLDJCQUFBLE1BQUEsRUFBQSxPQUFBLENBQVQ7QUFDQSxPQUFBO0FBQUEsUUFBQTtBQUFBLFVBQWMsTUFBTSxHQUFHLENBQUgsT0FBQSxDQUFwQixNQUFvQixDQUFwQjs7QUFDQSxjQUFBLFFBQUE7QUFBQSxhQUFBLE1BQUE7QUFBQSxhQUFBLFFBQUE7QUFBQSxhQUFBLEtBQUE7QUFBQSxhQUFBLE9BQUE7QUFBQSxhQUFBLFNBQUE7QUFBQSxhQUFBLE1BQUE7QUFBQSxhQUFBLFFBQUE7QUFBQSxhQUFBLFFBQUE7aUJBRUksU0FBUyxDQUFULFFBQUEsQ0FBQSxRQUFBLEM7O0FBRkosYUFBQSxRQUFBO2lCQUlJLFM7O0FBSko7QUFNSSxnQkFBTSxJQUFBLEtBQUEsQ0FBVSxvQkFBQSxRQUFWLEdBQUEsQ0FBTjtBQU5KO0FBSlEsS0FBVjs7QUFZQSxJQUFBLFNBQUEsR0FBWSxnQkFBQSxFQUFBLEVBQUEsSUFBQSxFQUFXLE9BQUEsR0FBWCxFQUFBLEVBQUE7QUFDVixVQUFBLGNBQUEsRUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQ0U7QUFBQSxRQUFBLGdCQUFBLEVBQUEsRUFBQTtBQUNBLFFBQUEsY0FBQSxFQUFnQixNQUFNLENBQU4sSUFBQSxDQUFBLElBQUEsRUFBQSxRQUFBO0FBRGhCLE9BREY7QUFHQSxNQUFBLE1BQUEsR0FBUywyQkFBQSxNQUFBLEVBQUEsT0FBQSxDQUFUO0FBQ0EsT0FBQTtBQUFBLFFBQUE7QUFBQSxVQUFtQixNQUFNLEdBQUcsQ0FBSCxTQUFBLENBQXpCLE1BQXlCLENBQXpCO2FBQ0EsY0FBYyxDQUFkLFFBQUEsQ0FBQSxRQUFBLEM7QUFOVSxLQUFaOztXQVNBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxNQUFBO0FBQUEsTUFBQSxjQUFBO0FBQUEsTUFBQSxRQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxTQUFBO0FBQUEsTUFBQSxPQUFBO0FBQUEsTUFBQSxPQUFBO0FBQUEsTUFBQTtBQUFBLEs7QUF2RkYsRztBQURpQixDQUFuQjs7ZUEyRmUsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIEtNUy5cbiMgTk9URTogSW4gS01TIG1ldGhvZHMgYmVzaWRlcyBcImNyZWF0ZVwiIGFuZCBcImRlbGV0ZVwiIGFuZCBcImFkZEFsaWFzXCI6IElEIGNhbiBiZSBrZXkgSUQsIGtleSBBUk4sIG9yIGtleSBhbGlhcyBuYW1lLlxuXG5pbXBvcnQge2NhdCwgbWVyZ2V9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHtub3RGb3VuZH0gZnJvbSBcIi4vcHJpdmF0ZS11dGlsc1wiXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5jb2duaXRvUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAga21zID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5LTVNcblxuICAgIGdldCA9IChpZCwgdG9rZW5zKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHBhcmFtcyA9IHtLZXlJZDogaWR9XG4gICAgICAgIHBhcmFtcy5HcmFudFRva2VucyA9IHRva2VucyBpZiB0b2tlbnNcbiAgICAgICAge0tleU1ldGFkYXRhfSA9IGF3YWl0IGttcy5kZXNjcmliZUtleSBwYXJhbXNcbiAgICAgICAgS2V5TWV0YWRhdGFcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZSwgNDAwLCBcIk5vdEZvdW5kRXhjZXB0aW9uXCJcblxuICAgIGNyZWF0ZSA9IChwYXJhbXM9e30pIC0+XG4gICAgICB7S2V5TWV0YWRhdGF9ID0gYXdhaXQga21zLmNyZWF0ZUtleSBwYXJhbXNcbiAgICAgIEtleU1ldGFkYXRhXG5cbiAgICBzY2hlZHVsZURlbGV0ZSA9IChpZCwgZGVsYXkpIC0+XG4gICAgICBwYXJhbXMgPSBLZXlJZDogaWRcbiAgICAgIHBhcmFtcy5QZW5kaW5nV2luZG93SW5EYXlzID0gZGVsYXkgaWYgZGVsYXlcbiAgICAgIGF3YWl0IGttcy5kZWxldGVLZXkgcGFyYW1zXG5cbiAgICBhZGRBbGlhcyA9IChUYXJnZXRLZXlJZCwgQWxpYXNOYW1lKSAtPlxuICAgICAgYXdhaXQga21zLmNyZWF0ZUFsaWFzIHtUYXJnZXRLZXlJZCwgQWxpYXNOYW1lfVxuXG4gICAgcmVtb3ZlQWxpYXMgPSAoQWxpYXNOYW1lKSAtPlxuICAgICAgYXdhaXQga21zLmRlbGV0ZUFsaWFzIHtBbGlhc05hbWV9XG5cbiAgICByYW5kb21LZXkgPSAoc2l6ZSwgZW5jb2Rpbmc9XCJoZXhcIikgLT5cbiAgICAgIHtQbGFpbnRleHR9ID0gYXdhaXQga21zLmdlbmVyYXRlUmFuZG9tIHtOdW1iZXJPZkJ5dGVzOiBzaXplfVxuICAgICAgc3dpdGNoIGVuY29kaW5nXG4gICAgICAgIHdoZW4gXCJidWZmZXJcIlxuICAgICAgICAgIFBsYWludGV4dFxuICAgICAgICB3aGVuIFwiYXNjaWlcIiwgXCJoZXhcIiwgXCJ1dGY4XCIsIFwidXRmMTZsZVwiLCBcInVjczJcIiwgXCJsYXRpbjFcIiwgXCJiaW5hcnlcIiwgXCJoZXhcIlxuICAgICAgICAgIFBsYWludGV4dC50b1N0cmluZyBlbmNvZGluZ1xuICAgICAgICB3aGVuIFwiYmFzZTY0XCJcbiAgICAgICAgICAjIE9taXR0aW5nIHBhZGRpbmcgY2hhcmFjdGVycywgcGVyOlxuICAgICAgICAgICMgaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzQ2NDgjc2VjdGlvbi0zLjJcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcoXCJiYXNlNjRcIilcbiAgICAgICAgICAucmVwbGFjZSgvXFw9KyQvLCAnJylcbiAgICAgICAgd2hlbiBcImJhc2U2NHBhZGRlZFwiXG4gICAgICAgICAgUGxhaW50ZXh0LnRvU3RyaW5nKFwiYmFzZTY0XCIpXG4gICAgICAgIHdoZW4gXCJiYXNlNjR1cmxcIlxuICAgICAgICAgICMgQmFzZWQgb24gUkZDIDQ2NDgncyBcImJhc2U2NHVybFwiIG1hcHBpbmc6XG4gICAgICAgICAgIyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNDY0OCNzZWN0aW9uLTVcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcoXCJiYXNlNjRcIilcbiAgICAgICAgICAucmVwbGFjZSgvXFwrL2csICctJylcbiAgICAgICAgICAucmVwbGFjZSgvXFwvL2csICdfJylcbiAgICAgICAgICAucmVwbGFjZSgvXFw9KyQvLCAnJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVua25vd24gZW5jb2RpbmcgI3tlbmNvZGluZ30uXCJcblxuICAgIGVuY3J5cHQgPSAoaWQsIHBsYWludGV4dCwgZW5jb2Rpbmc9XCJ1dGY4XCIsIG9wdGlvbnM9e30pIC0+XG4gICAgICBzd2l0Y2ggZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcInV0ZjhcIiwgXCJiYXNlNjRcIiwgXCJoZXhcIiwgXCJhc2NpaVwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCJcbiAgICAgICAgICBpbnB1dCA9IEJ1ZmZlci5mcm9tIHBsYWludGV4dCwgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJ1ZmZlclwiXG4gICAgICAgICAgaW5wdXQgPSBwbGFpbnRleHRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvciBcIlVua25vd24gZW5jb2RpbmcgI3tlbmNvZGluZ30uXCJcbiAgICAgIHBhcmFtcyA9XG4gICAgICAgIEtleUlkOiBpZFxuICAgICAgICBQbGFpbnRleHQ6IGlucHV0XG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtDaXBoZXJ0ZXh0QmxvYn0gPSBhd2FpdCBrbXMuZW5jcnlwdCBwYXJhbXNcbiAgICAgIENpcGhlcnRleHRCbG9iLnRvU3RyaW5nKFwiYmFzZTY0XCIpXG5cbiAgICBkZWNyeXB0ID0gKGJsb2IsIGVuY29kaW5nPVwidXRmOFwiLCBvcHRpb25zPXt9KSAtPlxuICAgICAgcGFyYW1zID0gQ2lwaGVydGV4dEJsb2I6IEJ1ZmZlci5mcm9tKGJsb2IsIFwiYmFzZTY0XCIpXG4gICAgICBwYXJhbXMgPSBtZXJnZSBwYXJhbXMsIG9wdGlvbnNcbiAgICAgIHtQbGFpbnRleHR9ID0gYXdhaXQga21zLmRlY3J5cHQgcGFyYW1zXG4gICAgICBzd2l0Y2ggZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcInV0ZjhcIiwgXCJiYXNlNjRcIiwgXCJoZXhcIiwgXCJhc2NpaVwiLCBcInV0ZjE2bGVcIiwgXCJ1Y3MyXCIsIFwibGF0aW4xXCIsIFwiYmluYXJ5XCJcbiAgICAgICAgICBQbGFpbnRleHQudG9TdHJpbmcgZW5jb2RpbmdcbiAgICAgICAgd2hlbiBcImJ1ZmZlclwiXG4gICAgICAgICAgUGxhaW50ZXh0XG4gICAgICAgIGVsc2VcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IgXCJVbmtub3duIGVuY29kaW5nICN7ZW5jb2Rpbmd9LlwiXG5cbiAgICByZUVuY3J5cHQgPSAoaWQsIGJsb2IsIG9wdGlvbnM9e30pIC0+XG4gICAgICBwYXJhbXMgPVxuICAgICAgICBEZXN0aW5hdGlvbktleUlkOiBpZFxuICAgICAgICBDeXBoZXJ0ZXh0QmxvYjogQnVmZmVyLmZyb20oYmxvYiwgXCJiYXNlNjRcIilcbiAgICAgIHBhcmFtcyA9IG1lcmdlIHBhcmFtcywgb3B0aW9uc1xuICAgICAge0NpcGhlcnRleHRCbG9ifSA9IGF3YWl0IGttcy5yZUVuY3J5cHQgcGFyYW1zXG4gICAgICBDaXBoZXJ0ZXh0QmxvYi50b1N0cmluZyhcImJhc2U2NFwiKVxuXG5cbiAgICB7Z2V0LCBjcmVhdGUsIHNjaGVkdWxlRGVsZXRlLCBhZGRBbGlhcywgcmVtb3ZlQWxpYXMsIHJhbmRvbUtleSwgZGVjcnlwdCwgZW5jcnlwdCwgcmVFbmNyeXB0fVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNvZ25pdG9QcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/kms.coffee