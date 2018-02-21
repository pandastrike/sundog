"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

var _utils = require("./utils");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service KMS.
// NOTE: In KMS, ID can be key ID, key ARN, or key alias name.
var cognitoPrimative;

cognitoPrimative = function (_AWS) {
  var decrypt, encrypt, get, kms, randomKey, reEncrypt;
  kms = _AWS.KMS;
  encrypt = (() => {
    var _ref = _asyncToGenerator(function* (id, plaintext, encoding = "utf8", options = {}) {
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
      ({ CiphertextBlob } = yield kms.encrypt(params));
      return CiphertextBlob.toString("base64");
    });

    return function encrypt(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
  decrypt = (() => {
    var _ref2 = _asyncToGenerator(function* (blob, encoding = "utf8", options = {}) {
      var Plaintext, params;
      params = {
        CiphertextBlob: Buffer.from(blob, "base64")
      };
      params = (0, _fairmont.merge)(params, options);
      ({ Plaintext } = yield kms.decrypt(params));
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

    return function decrypt(_x3) {
      return _ref2.apply(this, arguments);
    };
  })();
  reEncrypt = (() => {
    var _ref3 = _asyncToGenerator(function* (id, blob, options = {}) {
      var CiphertextBlob, params;
      params = {
        DestinationKeyId: id,
        CyphertextBlob: Buffer.from(blob, "base64")
      };
      params = (0, _fairmont.merge)(params, options);
      ({ CiphertextBlob } = yield kms.reEncrypt(params));
      return CiphertextBlob.toString("base64");
    });

    return function reEncrypt(_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  })();
  get = (() => {
    var _ref4 = _asyncToGenerator(function* (id, tokens) {
      var KeyMetadata, e, params;
      try {
        params = {
          KeyId: id
        };
        if (tokens) {
          params.GrantTokens = tokens;
        }
        ({ KeyMetadata } = yield kms.describeKey(params));
        return KeyMetadata;
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e, 400, "NotFoundException");
      }
    });

    return function get(_x6, _x7) {
      return _ref4.apply(this, arguments);
    };
  })();
  randomKey = (() => {
    var _ref5 = _asyncToGenerator(function* (size, encoding = "hex") {
      var Plaintext;
      ({ Plaintext } = yield kms.generateRandom({
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
          // http://tools.ietf.org/html/rfc4648#section-3.2
          return Plaintext.toString("base64").replace(/\=+$/, '');
        case "base64url":
          // Based on RFC 4648's "base64url" mapping:
          // http://tools.ietf.org/html/rfc4648#section-5
          return Plaintext.toString("base64").replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
        default:
          throw new Error(`Unknown encoding ${encoding}.`);
      }
    });

    return function randomKey(_x8) {
      return _ref5.apply(this, arguments);
    };
  })();
  return { decrypt, encrypt, get, reEncrypt, randomKey };
};

exports.default = cognitoPrimative;