"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require("path");

var _os = require("os");

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _fairmont = require("fairmont");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// SunDog uses the AWS-SDK and your credentials to directly interact with Amazon.
// In Node, SunDog looks to your home directory for credentials in their defualt location.
var Engine, awsPath, parseCreds;

// Looks for AWS credentials stored at ~/.aws/credentials
awsPath = (0, _path.join)((0, _os.homedir)(), ".aws", "credentials");

parseCreds = function (data) {
  var get, lines, where;
  lines = data.split("\n");
  get = function (line) {
    return line.split(/\s*=\s*/)[1];
  };
  where = function (phrase) {
    var i, j, ref;
    for (i = j = 0, ref = lines.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      if (lines[i].indexOf(phrase) >= 0) {
        return i;
      }
    }
  };
  return {
    id: get(lines[where("aws_access_key_id")]),
    key: get(lines[where("aws_secret_access_key")])
  };
};

Engine = (() => {
  var _ref = _asyncToGenerator(function* (region) {
    var id, key;
    ({ id, key } = parseCreds((yield (0, _fairmont.read)(awsPath))));
    _awsSdk2.default.config = {
      accessKeyId: id,
      secretAccessKey: key,
      region: region || "us-west-2",
      sslEnabled: true
    };
    return _awsSdk2.default;
  });

  return function Engine(_x) {
    return _ref.apply(this, arguments);
  };
})();

exports.default = Engine;