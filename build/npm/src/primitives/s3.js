"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require("fs");

var _fairmont = require("fairmont");

var _mime = require("mime");

var _mime2 = _interopRequireDefault(_mime);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service S3.  The main entities are buckets and objects.
// This follows the naming convention that methods that work on buckets will be
// prefixed "bucket*", whereas object methods will have no prefix.
var s3Primative,
    indexOf = [].indexOf;

s3Primative = function (_AWS) {
  var bucketDel, bucketEmpty, bucketExists, bucketTouch, del, exists, get, list, put, s3;
  s3 = _AWS.S3;
  bucketExists = (() => {
    var _ref = _asyncToGenerator(function* (name) {
      var e;
      try {
        yield s3.headBucket({
          Bucket: name
        });
        return true;
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    });

    return function bucketExists(_x) {
      return _ref.apply(this, arguments);
    };
  })();
  exists = (0, _fairmont.curry)((() => {
    var _ref2 = _asyncToGenerator(function* (name, key) {
      var e;
      try {
        yield s3.headObject({
          Bucket: name,
          Key: key
        });
        return true;
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    });

    return function (_x2, _x3) {
      return _ref2.apply(this, arguments);
    };
  })());
  bucketTouch = (() => {
    var _ref3 = _asyncToGenerator(function* (name) {
      if (yield bucketExists(name)) {
        return true;
      }
      yield s3.createBucket({
        Bucket: name
      });
      return yield (0, _fairmont.sleep)(15000); // race condition with S3 API.  Wait to be available.
    });

    return function bucketTouch(_x4) {
      return _ref3.apply(this, arguments);
    };
  })();
  put = (0, _fairmont.curry)((() => {
    var _ref4 = _asyncToGenerator(function* (name, key, data, filetype) {
      var body, content, params;
      if (filetype) {
        // here, data is stringified data.
        content = body = new Buffer(data);
      } else {
        // here, data is a path to file.
        filetype = _mime2.default.lookup(data);
        body = (0, _fs.createReadStream)(data);
        content = indexOf.call(_mime2.default.lookup(data), "text") >= 0 ? yield (0, _fairmont.read)(data) : yield (0, _fairmont.read)(data, "buffer");
      }
      params = {
        Bucket: name,
        Key: key,
        ContentType: filetype,
        ContentMD5: new Buffer((0, _fairmont.md5)(content), "hex").toString('base64'),
        Body: body
      };
      return yield s3.putObject(params);
    });

    return function (_x5, _x6, _x7, _x8) {
      return _ref4.apply(this, arguments);
    };
  })());
  get = (0, _fairmont.curry)((() => {
    var _ref5 = _asyncToGenerator(function* (name, key, encoding = "utf8") {
      var Body, e;
      try {
        ({ Body } = yield s3.getObject({
          Bucket: name,
          Key: key
        }));
        return Body.toString(encoding);
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    });

    return function (_x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  })());
  del = (0, _fairmont.curry)((() => {
    var _ref6 = _asyncToGenerator(function* (name, key) {
      var e;
      try {
        return yield s3.deleteObject({
          Bucket: name,
          Key: key
        });
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    });

    return function (_x11, _x12) {
      return _ref6.apply(this, arguments);
    };
  })());
  bucketDel = (() => {
    var _ref7 = _asyncToGenerator(function* (name) {
      var e;
      try {
        return yield s3.deleteBucket({
          Bucket: name
        });
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    });

    return function bucketDel(_x13) {
      return _ref7.apply(this, arguments);
    };
  })();
  list = (0, _fairmont.curry)((() => {
    var _ref8 = _asyncToGenerator(function* (name, items = [], marker) {
      var Contents, IsTruncated, NextContinuationToken, p;
      p = {
        Bucket: name,
        MaxKeys: 1000
      };
      if (marker) {
        p.ContinuationToken = marker;
      }
      ({ IsTruncated, Contents, NextContinuationToken } = yield s3.listObjectsV2(p));
      if (IsTruncated) {
        items = (0, _fairmont.cat)(items, Contents);
        return yield list(name, items, NextContinuationToken);
      } else {
        return (0, _fairmont.cat)(items, Contents);
      }
    });

    return function (_x14) {
      return _ref8.apply(this, arguments);
    };
  })());
  // TODO: make this more efficient by throttling to X connections at once. AWS
  // only supports N requests per second from an account, and I don't want this
  // to violate that limit, but we can do better than one at a time.
  bucketEmpty = (() => {
    var _ref9 = _asyncToGenerator(function* (name) {
      var i, items, j, len, results;
      items = yield list(name);
      results = [];
      for (j = 0, len = items.length; j < len; j++) {
        i = items[j];
        results.push((yield del(name, i.Key)));
      }
      return results;
    });

    return function bucketEmpty(_x15) {
      return _ref9.apply(this, arguments);
    };
  })();
  return { bucketExists, exists, bucketTouch, put, get, del, bucketDel, list, bucketEmpty };
};

exports.default = s3Primative;