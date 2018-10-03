"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _fairmont = require("fairmont");

var _mime = _interopRequireDefault(require("mime"));

var _utils = require("./utils");

var _lift = require("../lift");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Primitives for the service S3.  The main entities are buckets and objects.
// This follows the naming convention that methods that work on buckets will be
// prefixed "bucket*", whereas object methods will have no prefix.
var s3Primitive,
    indexOf = [].indexOf;

s3Primitive = function (SDK) {
  return function (configuration) {
    var bucketDel, bucketEmpty, bucketExists, bucketPutACL, bucketTouch, del, exists, get, list, multipartAbort, multipartComplete, multipartPut, multipartStart, put, s3, sign, signPost;
    s3 = (0, _lift.applyConfiguration)(configuration, SDK.S3);

    bucketExists =
    /*#__PURE__*/
    function () {
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
    }();

    exists = (0, _fairmont.curry)(
    /*#__PURE__*/
    function () {
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
    }());

    bucketTouch =
    /*#__PURE__*/
    function () {
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
    }();

    put = (0, _fairmont.curry)(
    /*#__PURE__*/
    function () {
      var _ref4 = _asyncToGenerator(function* (Bucket, Key, data, filetype) {
        var body, content;

        if (filetype) {
          // here, data is stringified data.
          content = body = new Buffer(data);
        } else {
          // here, data is a path to file.
          filetype = _mime.default.getType(data);
          body = (0, _fs.createReadStream)(data);
          content = indexOf.call(_mime.default.getType(data), "text") >= 0 ? yield (0, _fairmont.read)(data) : yield (0, _fairmont.read)(data, "buffer");
        }

        return yield s3.putObject({
          Bucket,
          Key,
          ContentType: filetype,
          ContentMD5: new Buffer((0, _fairmont.md5)(content), "hex").toString('base64'),
          Body: body
        });
      });

      return function (_x5, _x6, _x7, _x8) {
        return _ref4.apply(this, arguments);
      };
    }());
    get = (0, _fairmont.curry)(
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(function* (name, key, encoding = "utf8") {
        var Body, e;

        try {
          ({
            Body
          } = yield s3.getObject({
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
    }());
    del = (0, _fairmont.curry)(
    /*#__PURE__*/
    function () {
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
    }());

    bucketDel =
    /*#__PURE__*/
    function () {
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
    }();

    list = (0, _fairmont.curry)(
    /*#__PURE__*/
    function () {
      var _ref8 = _asyncToGenerator(function* (name, items = [], marker) {
        var Contents, IsTruncated, NextContinuationToken, p;
        p = {
          Bucket: name,
          MaxKeys: 1000
        };

        if (marker) {
          p.ContinuationToken = marker;
        }

        ({
          IsTruncated,
          Contents,
          NextContinuationToken
        } = yield s3.listObjectsV2(p));

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
    }()); // TODO: make this more efficient by throttling to X connections at once. AWS
    // only supports N requests per second from an account, and I don't want this
    // to violate that limit, but we can do better than one at a time.

    bucketEmpty =
    /*#__PURE__*/
    function () {
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
    }();

    bucketPutACL =
    /*#__PURE__*/
    function () {
      var _ref10 = _asyncToGenerator(function* (parameters) {
        return yield s3.putBucketAcl(parameters);
      });

      return function bucketPutACL(_x16) {
        return _ref10.apply(this, arguments);
      };
    }(); //####
    // Multipart upload functions
    //####


    multipartStart =
    /*#__PURE__*/
    function () {
      var _ref11 = _asyncToGenerator(function* (Bucket, Key, ContentType, options = {}) {
        return yield s3.createMultipartUpload((0, _fairmont.merge)({
          Bucket,
          Key,
          ContentType
        }, options));
      });

      return function multipartStart(_x17, _x18, _x19) {
        return _ref11.apply(this, arguments);
      };
    }();

    multipartAbort =
    /*#__PURE__*/
    function () {
      var _ref12 = _asyncToGenerator(function* (Bucket, Key, UploadId) {
        return yield s3.abortMultipartUpload({
          Bucket,
          Key,
          UploadId
        });
      });

      return function multipartAbort(_x20, _x21, _x22) {
        return _ref12.apply(this, arguments);
      };
    }();

    multipartComplete =
    /*#__PURE__*/
    function () {
      var _ref13 = _asyncToGenerator(function* (Bucket, Key, UploadId, MultipartUpload) {
        return yield s3.completeMultipartUpload({
          Bucket,
          Key,
          UploadId,
          MultipartUpload
        });
      });

      return function multipartComplete(_x23, _x24, _x25, _x26) {
        return _ref13.apply(this, arguments);
      };
    }();

    multipartPut =
    /*#__PURE__*/
    function () {
      var _ref14 = _asyncToGenerator(function* (Bucket, Key, UploadId, PartNumber, part, filetype) {
        var body, content;

        if (filetype) {
          // here, data is stringified data.
          content = body = new Buffer(part);
        } else {
          // here, data is a path to file.
          filetype = _mime.default.getType(part);
          body = (0, _fs.createReadStream)(part);
          content = indexOf.call(filetype, "text") >= 0 ? yield (0, _fairmont.read)(part) : yield (0, _fairmont.read)(part, "buffer");
        }

        return yield s3.uploadPart({
          Bucket,
          Key,
          UploadId,
          PartNumber,
          ContentType: filetype,
          ContentMD5: new Buffer((0, _fairmont.md5)(content), "hex").toString('base64'),
          Body: body
        });
      });

      return function multipartPut(_x27, _x28, _x29, _x30, _x31, _x32) {
        return _ref14.apply(this, arguments);
      };
    }(); // Signing a URL grants the bearer the ability to perform the given action against an S3 object, even if they are not you.


    sign =
    /*#__PURE__*/
    function () {
      var _ref15 = _asyncToGenerator(function* (action, parameters) {
        return yield s3.getSignedUrl(action, parameters);
      });

      return function sign(_x33, _x34) {
        return _ref15.apply(this, arguments);
      };
    }();

    signPost =
    /*#__PURE__*/
    function () {
      var _ref16 = _asyncToGenerator(function* (parameters) {
        return yield s3.createPresignedPost(parameters);
      });

      return function signPost(_x35) {
        return _ref16.apply(this, arguments);
      };
    }();

    return {
      bucketExists,
      exists,
      bucketTouch,
      put,
      get,
      del,
      bucketDel,
      list,
      bucketEmpty,
      multipartStart,
      multipartAbort,
      multipartPut,
      multipartComplete,
      sign,
      signPost
    };
  };
};

var _default = s3Primitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,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QUFBLEVBQUE7QUFDTCxxQkFBTSxFQUFFLENBQUYsWUFBQSxDQUFBLE1BQUEsRUFBTixVQUFNLENBQU47QUFESyxPQUFQOztBQUFBO0FBQUE7QUFBQTtBQUFBLE9BQUE7O0FBR0EsSUFBQSxRQUFBO0FBQUE7QUFBQTtBQUFBLHFDQUFXLFdBQUEsVUFBQSxFQUFBO0FBQ1QscUJBQU0sRUFBRSxDQUFGLG1CQUFBLENBQU4sVUFBTSxDQUFOO0FBRFMsT0FBWDs7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUFBOztXQUlBO0FBQUEsTUFBQSxZQUFBO0FBQUEsTUFBQSxNQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBO0FBQUEsTUFBQSxZQUFBO0FBQUEsTUFBQSxpQkFBQTtBQUFBLE1BQUEsSUFBQTtBQUFBLE1BQUE7QUFBQSxLO0FBN0hGLEc7QUFEWSxDQUFkOztlQWlJZSxXIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBTMy4gIFRoZSBtYWluIGVudGl0aWVzIGFyZSBidWNrZXRzIGFuZCBvYmplY3RzLlxuIyBUaGlzIGZvbGxvd3MgdGhlIG5hbWluZyBjb252ZW50aW9uIHRoYXQgbWV0aG9kcyB0aGF0IHdvcmsgb24gYnVja2V0cyB3aWxsIGJlXG4jIHByZWZpeGVkIFwiYnVja2V0KlwiLCB3aGVyZWFzIG9iamVjdCBtZXRob2RzIHdpbGwgaGF2ZSBubyBwcmVmaXguXG5cbmltcG9ydCB7Y3JlYXRlUmVhZFN0cmVhbX0gZnJvbSBcImZzXCJcbmltcG9ydCB7Y3VycnksIHNsZWVwLCByZWFkLCBtZDUsIGNhdCwgbWVyZ2V9IGZyb20gXCJmYWlybW9udFwiXG5pbXBvcnQgbWltZSBmcm9tIFwibWltZVwiXG5cbmltcG9ydCB7bm90Rm91bmR9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7YXBwbHlDb25maWd1cmF0aW9ufSBmcm9tIFwiLi4vbGlmdFwiXG5cbnMzUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgczMgPSBhcHBseUNvbmZpZ3VyYXRpb24gY29uZmlndXJhdGlvbiwgU0RLLlMzXG5cbiAgICBidWNrZXRFeGlzdHMgPSAobmFtZSkgLT5cbiAgICAgIHRyeVxuICAgICAgICBhd2FpdCBzMy5oZWFkQnVja2V0IEJ1Y2tldDogbmFtZVxuICAgICAgICB0cnVlXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGV4aXN0cyA9IGN1cnJ5IChuYW1lLCBrZXkpIC0+XG4gICAgICB0cnlcbiAgICAgICAgYXdhaXQgczMuaGVhZE9iamVjdCB7QnVja2V0OiBuYW1lLCBLZXk6IGtleX1cbiAgICAgICAgdHJ1ZVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBub3RGb3VuZCBlXG5cbiAgICBidWNrZXRUb3VjaCA9IChuYW1lKSAtPlxuICAgICAgcmV0dXJuIHRydWUgaWYgYXdhaXQgYnVja2V0RXhpc3RzIG5hbWVcbiAgICAgIGF3YWl0IHMzLmNyZWF0ZUJ1Y2tldCB7QnVja2V0OiBuYW1lfVxuICAgICAgYXdhaXQgc2xlZXAgMTUwMDAgIyByYWNlIGNvbmRpdGlvbiB3aXRoIFMzIEFQSS4gIFdhaXQgdG8gYmUgYXZhaWxhYmxlLlxuXG4gICAgcHV0ID0gY3VycnkgKEJ1Y2tldCwgS2V5LCBkYXRhLCBmaWxldHlwZSkgLT5cbiAgICAgIGlmIGZpbGV0eXBlXG4gICAgICAgICMgaGVyZSwgZGF0YSBpcyBzdHJpbmdpZmllZCBkYXRhLlxuICAgICAgICBjb250ZW50ID0gYm9keSA9IG5ldyBCdWZmZXIgZGF0YVxuICAgICAgZWxzZVxuICAgICAgICAjIGhlcmUsIGRhdGEgaXMgYSBwYXRoIHRvIGZpbGUuXG4gICAgICAgIGZpbGV0eXBlID0gbWltZS5nZXRUeXBlIGRhdGFcbiAgICAgICAgYm9keSA9IGNyZWF0ZVJlYWRTdHJlYW0gZGF0YVxuICAgICAgICBjb250ZW50ID1cbiAgICAgICAgICBpZiBcInRleHRcIiBpbiBtaW1lLmdldFR5cGUoZGF0YSlcbiAgICAgICAgICAgIGF3YWl0IHJlYWQgZGF0YVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGF3YWl0IHJlYWQgZGF0YSwgXCJidWZmZXJcIlxuXG4gICAgICBhd2FpdCBzMy5wdXRPYmplY3Qge1xuICAgICAgICBCdWNrZXQsIEtleSxcbiAgICAgICAgQ29udGVudFR5cGU6IGZpbGV0eXBlXG4gICAgICAgIENvbnRlbnRNRDU6IG5ldyBCdWZmZXIobWQ1KGNvbnRlbnQpLCBcImhleFwiKS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgQm9keTogYm9keVxuICAgICAgfVxuXG4gICAgZ2V0ID0gY3VycnkgKG5hbWUsIGtleSwgZW5jb2Rpbmc9XCJ1dGY4XCIpIC0+XG4gICAgICB0cnlcbiAgICAgICAge0JvZHl9ID0gYXdhaXQgczMuZ2V0T2JqZWN0IHtCdWNrZXQ6IG5hbWUsIEtleToga2V5fVxuICAgICAgICBCb2R5LnRvU3RyaW5nIGVuY29kaW5nXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGRlbCA9IGN1cnJ5IChuYW1lLCBrZXkpIC0+XG4gICAgICB0cnlcbiAgICAgICAgYXdhaXQgczMuZGVsZXRlT2JqZWN0IHtCdWNrZXQ6IG5hbWUsIEtleToga2V5fVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBub3RGb3VuZCBlXG5cbiAgICBidWNrZXREZWwgPSAobmFtZSkgLT5cbiAgICAgIHRyeVxuICAgICAgICBhd2FpdCBzMy5kZWxldGVCdWNrZXQgQnVja2V0OiBuYW1lXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGxpc3QgPSBjdXJyeSAobmFtZSwgaXRlbXM9W10sIG1hcmtlcikgLT5cbiAgICAgIHAgPSB7QnVja2V0OiBuYW1lLCBNYXhLZXlzOiAxMDAwfVxuICAgICAgcC5Db250aW51YXRpb25Ub2tlbiA9IG1hcmtlciBpZiBtYXJrZXJcblxuICAgICAge0lzVHJ1bmNhdGVkLCBDb250ZW50cywgTmV4dENvbnRpbnVhdGlvblRva2VufSA9IGF3YWl0IHMzLmxpc3RPYmplY3RzVjIgcFxuICAgICAgaWYgSXNUcnVuY2F0ZWRcbiAgICAgICAgaXRlbXMgPSBjYXQgaXRlbXMsIENvbnRlbnRzXG4gICAgICAgIGF3YWl0IGxpc3QgbmFtZSwgaXRlbXMsIE5leHRDb250aW51YXRpb25Ub2tlblxuICAgICAgZWxzZVxuICAgICAgICBjYXQgaXRlbXMsIENvbnRlbnRzXG5cbiAgICAjIFRPRE86IG1ha2UgdGhpcyBtb3JlIGVmZmljaWVudCBieSB0aHJvdHRsaW5nIHRvIFggY29ubmVjdGlvbnMgYXQgb25jZS4gQVdTXG4gICAgIyBvbmx5IHN1cHBvcnRzIE4gcmVxdWVzdHMgcGVyIHNlY29uZCBmcm9tIGFuIGFjY291bnQsIGFuZCBJIGRvbid0IHdhbnQgdGhpc1xuICAgICMgdG8gdmlvbGF0ZSB0aGF0IGxpbWl0LCBidXQgd2UgY2FuIGRvIGJldHRlciB0aGFuIG9uZSBhdCBhIHRpbWUuXG4gICAgYnVja2V0RW1wdHkgPSAobmFtZSkgLT5cbiAgICAgIGl0ZW1zID0gYXdhaXQgbGlzdCBuYW1lXG4gICAgICBhd2FpdCBkZWwgbmFtZSwgaS5LZXkgZm9yIGkgaW4gaXRlbXNcblxuICAgIGJ1Y2tldFB1dEFDTCA9IChwYXJhbWV0ZXJzKSAtPlxuICAgICAgYXdhaXQgczMucHV0QnVja2V0QWNsIHBhcmFtZXRlcnNcblxuICAgICMjIyMjXG4gICAgIyBNdWx0aXBhcnQgdXBsb2FkIGZ1bmN0aW9uc1xuICAgICMjIyMjXG4gICAgbXVsdGlwYXJ0U3RhcnQgPSAoQnVja2V0LCBLZXksIENvbnRlbnRUeXBlLCBvcHRpb25zPXt9KSAtPlxuICAgICAgYXdhaXQgczMuY3JlYXRlTXVsdGlwYXJ0VXBsb2FkIG1lcmdlIHtCdWNrZXQsIEtleSwgQ29udGVudFR5cGV9LCBvcHRpb25zXG5cbiAgICBtdWx0aXBhcnRBYm9ydCA9IChCdWNrZXQsIEtleSwgVXBsb2FkSWQpIC0+XG4gICAgICBhd2FpdCBzMy5hYm9ydE11bHRpcGFydFVwbG9hZCB7QnVja2V0LCBLZXksIFVwbG9hZElkfVxuXG4gICAgbXVsdGlwYXJ0Q29tcGxldGUgPSAoQnVja2V0LCBLZXksIFVwbG9hZElkLCBNdWx0aXBhcnRVcGxvYWQpIC0+XG4gICAgICBhd2FpdCBzMy5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCB7QnVja2V0LCBLZXksIFVwbG9hZElkLCBNdWx0aXBhcnRVcGxvYWR9XG5cbiAgICBtdWx0aXBhcnRQdXQgPSAoQnVja2V0LCBLZXksIFVwbG9hZElkLCBQYXJ0TnVtYmVyLCBwYXJ0LCBmaWxldHlwZSkgLT5cbiAgICAgIGlmIGZpbGV0eXBlXG4gICAgICAgICMgaGVyZSwgZGF0YSBpcyBzdHJpbmdpZmllZCBkYXRhLlxuICAgICAgICBjb250ZW50ID0gYm9keSA9IG5ldyBCdWZmZXIgcGFydFxuICAgICAgZWxzZVxuICAgICAgICAjIGhlcmUsIGRhdGEgaXMgYSBwYXRoIHRvIGZpbGUuXG4gICAgICAgIGZpbGV0eXBlID0gbWltZS5nZXRUeXBlIHBhcnRcbiAgICAgICAgYm9keSA9IGNyZWF0ZVJlYWRTdHJlYW0gcGFydFxuICAgICAgICBjb250ZW50ID1cbiAgICAgICAgICBpZiBcInRleHRcIiBpbiBmaWxldHlwZVxuICAgICAgICAgICAgYXdhaXQgcmVhZCBwYXJ0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXdhaXQgcmVhZCBwYXJ0LCBcImJ1ZmZlclwiXG5cbiAgICAgIGF3YWl0IHMzLnVwbG9hZFBhcnQge1xuICAgICAgICBCdWNrZXQsIEtleSwgVXBsb2FkSWQsIFBhcnROdW1iZXIsXG4gICAgICAgIENvbnRlbnRUeXBlOiBmaWxldHlwZVxuICAgICAgICBDb250ZW50TUQ1OiBuZXcgQnVmZmVyKG1kNShjb250ZW50KSwgXCJoZXhcIikudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgICAgIEJvZHk6IGJvZHlcbiAgICAgIH1cblxuXG4gICAgIyBTaWduaW5nIGEgVVJMIGdyYW50cyB0aGUgYmVhcmVyIHRoZSBhYmlsaXR5IHRvIHBlcmZvcm0gdGhlIGdpdmVuIGFjdGlvbiBhZ2FpbnN0IGFuIFMzIG9iamVjdCwgZXZlbiBpZiB0aGV5IGFyZSBub3QgeW91LlxuICAgIHNpZ24gPSAoYWN0aW9uLCBwYXJhbWV0ZXJzKSAtPlxuICAgICAgYXdhaXQgczMuZ2V0U2lnbmVkVXJsIGFjdGlvbiwgcGFyYW1ldGVyc1xuXG4gICAgc2lnblBvc3QgPSAocGFyYW1ldGVycykgLT5cbiAgICAgIGF3YWl0IHMzLmNyZWF0ZVByZXNpZ25lZFBvc3QgcGFyYW1ldGVyc1xuXG5cbiAgICB7YnVja2V0RXhpc3RzLCBleGlzdHMsIGJ1Y2tldFRvdWNoLCBwdXQsIGdldCwgZGVsLCBidWNrZXREZWwsIGxpc3QsIGJ1Y2tldEVtcHR5LCBtdWx0aXBhcnRTdGFydCwgbXVsdGlwYXJ0QWJvcnQsIG11bHRpcGFydFB1dCwgbXVsdGlwYXJ0Q29tcGxldGUsIHNpZ24sIHNpZ25Qb3N0fVxuXG5cbmV4cG9ydCBkZWZhdWx0IHMzUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=primitives/s3.coffee