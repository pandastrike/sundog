"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _os = require("os");

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _fairmont = require("fairmont");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

Engine =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(function* (region) {
    var id, key;
    ({
      id,
      key
    } = parseCreds((yield (0, _fairmont.read)(awsPath))));
    _awsSdk.default.config = {
      accessKeyId: id,
      secretAccessKey: key,
      region: region || "us-west-2",
      sslEnabled: true
    };
    return _awsSdk.default;
  });

  return function Engine(_x) {
    return _ref.apply(this, arguments);
  };
}();

var _default = Engine;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZ2luZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUxBOztBQUFBLElBQUEsTUFBQSxFQUFBLE9BQUEsRUFBQSxVQUFBOztBQVFBLE9BQUEsR0FBVSxnQkFBQSxrQkFBQSxFQUFBLE1BQUEsRUFBQSxhQUFBLENBQVY7O0FBRUEsVUFBQSxHQUFhLFVBQUEsSUFBQSxFQUFBO0FBQ1gsTUFBQSxHQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUE7QUFBQSxFQUFBLEtBQUEsR0FBUSxJQUFJLENBQUosS0FBQSxDQUFBLElBQUEsQ0FBUjs7QUFDQSxFQUFBLEdBQUEsR0FBTSxVQUFBLElBQUEsRUFBQTtXQUFVLElBQUksQ0FBSixLQUFBLENBQUEsU0FBQSxFQUFzQixDQUF0QixDO0FBQVYsR0FBTjs7QUFDQSxFQUFBLEtBQUEsR0FBUSxVQUFBLE1BQUEsRUFBQTtBQUNOLFFBQUEsQ0FBQSxFQUFBLENBQUEsRUFBQSxHQUFBOztBQUFBLFNBQVMsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFULEVBQVMsS0FBQSxHQUFBLEdBQUEsQ0FBQSxHQUFBLEdBQUEsR0FBQSxDQUFBLEdBQUEsR0FBVCxFQUFTLENBQUEsR0FBQSxLQUFBLEdBQUEsR0FBQSxFQUFBLENBQUEsR0FBQSxFQUFULENBQUEsRUFBQTtBQUNFLFVBQVksS0FBTSxDQUFBLENBQUEsQ0FBTixDQUFBLE9BQUEsQ0FBQSxNQUFBLEtBQVosQ0FBQSxFQUFBO0FBQUEsZUFBQSxDQUFBOztBQURGO0FBRE0sR0FBUjs7U0FJQTtBQUFBLElBQUEsRUFBQSxFQUFJLEdBQUEsQ0FBSSxLQUFNLENBQUEsS0FBQSxDQUFkLG1CQUFjLENBQUEsQ0FBVixDQUFKO0FBQ0EsSUFBQSxHQUFBLEVBQUssR0FBQSxDQUFJLEtBQU0sQ0FBQSxLQUFBLENBQVYsdUJBQVUsQ0FBQSxDQUFWO0FBREwsRztBQVBXLENBQWI7O0FBVUEsTUFBQTtBQUFBO0FBQUE7QUFBQSwrQkFBUyxXQUFBLE1BQUEsRUFBQTtBQUNQLFFBQUEsRUFBQSxFQUFBLEdBQUE7QUFBQSxLQUFBO0FBQUEsTUFBQSxFQUFBO0FBQUEsTUFBQTtBQUFBLFFBQVksVUFBQSxRQUFpQixvQkFBN0IsT0FBNkIsQ0FBakIsRUFBWjtBQUNBLG9CQUFBLE1BQUEsR0FDRztBQUFBLE1BQUEsV0FBQSxFQUFBLEVBQUE7QUFDQSxNQUFBLGVBQUEsRUFEQSxHQUFBO0FBRUEsTUFBQSxNQUFBLEVBQVEsTUFBQSxJQUZSLFdBQUE7QUFHQSxNQUFBLFVBQUEsRUFBWTtBQUhaLEtBREg7V0FLQSxlO0FBUE8sR0FBVDs7QUFBQTtBQUFBO0FBQUE7QUFBQSxHQUFBOztlQVNlLE0iLCJzb3VyY2VzQ29udGVudCI6WyIjIFN1bkRvZyB1c2VzIHRoZSBBV1MtU0RLIGFuZCB5b3VyIGNyZWRlbnRpYWxzIHRvIGRpcmVjdGx5IGludGVyYWN0IHdpdGggQW1hem9uLlxuIyBJbiBOb2RlLCBTdW5Eb2cgbG9va3MgdG8geW91ciBob21lIGRpcmVjdG9yeSBmb3IgY3JlZGVudGlhbHMgaW4gdGhlaXIgZGVmdWFsdCBsb2NhdGlvbi5cbmltcG9ydCB7am9pbn0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHtob21lZGlyfSBmcm9tIFwib3NcIlxuaW1wb3J0IEFXUyBmcm9tIFwiYXdzLXNka1wiXG5pbXBvcnQge3JlYWR9IGZyb20gXCJmYWlybW9udFwiXG5cbiMgTG9va3MgZm9yIEFXUyBjcmVkZW50aWFscyBzdG9yZWQgYXQgfi8uYXdzL2NyZWRlbnRpYWxzXG5hd3NQYXRoID0gam9pbiBob21lZGlyKCksIFwiLmF3c1wiLCBcImNyZWRlbnRpYWxzXCJcblxucGFyc2VDcmVkcyA9IChkYXRhKSAtPlxuICBsaW5lcyA9IGRhdGEuc3BsaXQgXCJcXG5cIlxuICBnZXQgPSAobGluZSkgLT4gbGluZS5zcGxpdCgvXFxzKj1cXHMqLylbMV1cbiAgd2hlcmUgPSAocGhyYXNlKSAtPlxuICAgIGZvciBpIGluIFswLi4ubGluZXMubGVuZ3RoXVxuICAgICAgcmV0dXJuIGkgaWYgbGluZXNbaV0uaW5kZXhPZihwaHJhc2UpID49IDBcblxuICBpZDogZ2V0IGxpbmVzW3doZXJlIFwiYXdzX2FjY2Vzc19rZXlfaWRcIl1cbiAga2V5OiBnZXQgbGluZXNbd2hlcmUgXCJhd3Nfc2VjcmV0X2FjY2Vzc19rZXlcIl1cblxuRW5naW5lID0gKHJlZ2lvbikgLT5cbiAge2lkLCBrZXl9ID0gcGFyc2VDcmVkcyBhd2FpdCByZWFkIGF3c1BhdGhcbiAgQVdTLmNvbmZpZyA9XG4gICAgIGFjY2Vzc0tleUlkOiBpZFxuICAgICBzZWNyZXRBY2Nlc3NLZXk6IGtleVxuICAgICByZWdpb246IHJlZ2lvbiB8fCBcInVzLXdlc3QtMlwiXG4gICAgIHNzbEVuYWJsZWQ6IHRydWVcbiAgQVdTXG5cbmV4cG9ydCBkZWZhdWx0IEVuZ2luZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=engine.coffee