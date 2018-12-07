"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _crypto = _interopRequireDefault(require("crypto"));

var _pandaParchment = require("panda-parchment");

var _pandaQuill = require("panda-quill");

var _pandaGenerics = require("panda-generics");

var _mime = _interopRequireDefault(require("mime"));

var _utils = require("./utils");

var _lift = require("../lift");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Primitives for the service S3.  The main entities are buckets and objects.
// This follows the naming convention that methods that work on buckets will be
// prefixed "bucket*", whereas object methods will have no prefix.
var md5, s3Primitive;

md5 = function (buffer) {
  return _crypto.default.createHash('md5').update(buffer).digest("base64");
};

s3Primitive = function (SDK) {
  return function (configuration) {
    var bucketDel, bucketEmpty, bucketExists, bucketHead, bucketPutACL, bucketTouch, del, exists, get, head, list, multipartAbort, multipartComplete, multipartPut, multipartStart, put, s3, sign, signPost;
    s3 = (0, _lift.applyConfiguration)(configuration, SDK.S3);

    bucketHead = bucketExists = async function (name) {
      var e;

      try {
        return await s3.headBucket({
          Bucket: name
        });
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    };

    head = exists = async function (name, key) {
      var e;

      try {
        return await s3.headObject({
          Bucket: name,
          Key: key
        });
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    };

    bucketTouch = async function (name) {
      if (await bucketExists(name)) {
        return true;
      }

      await s3.createBucket({
        Bucket: name
      });
      return await (0, _pandaParchment.sleep)(15000); // race condition with S3 API.  Wait to be available.
    };

    put = _pandaGenerics.Method.create({
      default: function (...args) {
        console.error("sundog:s3:put, unable to match to method on", args);
        throw new Error();
      }
    }); // Putting a buffer of raw data to S3

    _pandaGenerics.Method.define(put, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isBuffer, _pandaParchment.isString, async function (Bucket, Key, buffer, type) {
      return await s3.putObject({
        Bucket,
        Key,
        ContentType: type,
        ContentMD5: md5(buffer),
        Body: buffer
      });
    }); // Putting a string to S3


    _pandaGenerics.Method.define(put, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, function (Bucket, Key, text, type) {
      return put(Bucket, Key, Buffer.from(text, type), type);
    }); // Putting a file on disk to S3


    _pandaGenerics.Method.define(put, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, function (Bucket, Key, path) {
      return put(Bucket, Key, (0, _pandaQuill.read)(path, "buffer"), _mime.default.getType(path));
    }); // Putting a file on disk to S3, with type override


    _pandaGenerics.Method.define(put, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isObject, function (Bucket, Key, file) {
      return put(Bucket, Key, (0, _pandaQuill.read)(file.path, "buffer"), file.type);
    });

    get = async function (name, key, encoding = "utf8") {
      var Body, e;

      try {
        ({
          Body
        } = await s3.getObject({
          Bucket: name,
          Key: key
        }));

        if (encoding === "binary") {
          return Body;
        } else {
          return Body.toString(encoding);
        }
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    };

    del = async function (name, key) {
      var e;

      try {
        return await s3.deleteObject({
          Bucket: name,
          Key: key
        });
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    };

    bucketDel = async function (name) {
      var e;

      try {
        return await s3.deleteBucket({
          Bucket: name
        });
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    };

    list = async function (name, items = [], marker) {
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
      } = await s3.listObjectsV2(p));

      if (IsTruncated) {
        items = (0, _pandaParchment.cat)(items, Contents);
        return await list(name, items, NextContinuationToken);
      } else {
        return (0, _pandaParchment.cat)(items, Contents);
      }
    }; // TODO: make this more efficient by throttling to X connections at once. AWS
    // only supports N requests per second from an account, and I don't want this
    // to violate that limit, but we can do better than one at a time.


    bucketEmpty = async function (name) {
      var i, items, j, len, results;
      items = await list(name);
      results = [];

      for (j = 0, len = items.length; j < len; j++) {
        i = items[j];
        results.push((await del(name, i.Key)));
      }

      return results;
    };

    bucketPutACL = async function (parameters) {
      return await s3.putBucketAcl(parameters);
    }; //####
    // Multipart upload functions
    //####


    multipartStart = async function (Bucket, Key, ContentType, options = {}) {
      return await s3.createMultipartUpload((0, _pandaParchment.merge)({
        Bucket,
        Key,
        ContentType
      }, options));
    };

    multipartAbort = async function (Bucket, Key, UploadId) {
      return await s3.abortMultipartUpload({
        Bucket,
        Key,
        UploadId
      });
    };

    multipartComplete = async function (Bucket, Key, UploadId, MultipartUpload) {
      return await s3.completeMultipartUpload({
        Bucket,
        Key,
        UploadId,
        MultipartUpload
      });
    };

    multipartPut = _pandaGenerics.Method.create({
      default: function (...args) {
        console.error("sundog:s3:multipartPut, unable to match method on", args);
        throw new Error();
      }
    }); // Putting a buffer of raw data to S3

    _pandaGenerics.Method.define(multipartPut, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isBuffer, _pandaParchment.isString, async function (Bucket, Key, UploadId, PartNumber, buffer, type) {
      return await s3.uploadPart({
        Bucket,
        Key,
        UploadId,
        PartNumber,
        ContentType: type,
        ContentMD5: md5(buffer),
        Body: buffer
      });
    }); // Putting a string to S3


    _pandaGenerics.Method.define(multipartPut, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, function (Bucket, Key, UploadId, PartNumber, text, type) {
      return multipartPut(Bucket, Key, UploadId, PartNumber, Buffer.from(text, type), type);
    }); // Putting a file on disk to S3


    _pandaGenerics.Method.define(multipartPut, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString);

    (function (Bucket, Key, UploadId, PartNumber, path) {
      return multipartPut(Bucket, Key, UploadId, PartNumber, (0, _pandaQuill.read)(path, "buffer"), _mime.default.getType(path));
    }); // Putting a file on disk to S3, with type override


    _pandaGenerics.Method.define(multipartPut, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString, _pandaParchment.isString);

    (function (Bucket, Key, UploadId, PartNumber, path) {
      return multipartPut(Bucket, Key, UploadId, PartNumber, (0, _pandaQuill.read)(file.path, "buffer"), file.type);
    }); // Signing a URL grants the bearer the ability to perform the given action against an S3 object, even if they are not you.


    sign = async function (action, parameters) {
      return await s3.getSignedUrl(action, parameters);
    };

    signPost = async function (parameters) {
      return await s3.createPresignedPost(parameters);
    };

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
//# sourceMappingURL=data:application/json;base64,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LGdCQUFBLE1BQUEsRUFBQSxVQUFBLEVBQUE7QUFDTCxhQUFBLE1BQU0sRUFBRSxDQUFGLFlBQUEsQ0FBQSxNQUFBLEVBQU4sVUFBTSxDQUFOO0FBREssS0FBUDs7QUFHQSxJQUFBLFFBQUEsR0FBVyxnQkFBQSxVQUFBLEVBQUE7QUFDVCxhQUFBLE1BQU0sRUFBRSxDQUFGLG1CQUFBLENBQU4sVUFBTSxDQUFOO0FBRFMsS0FBWDs7V0FJQTtBQUFBLE1BQUEsWUFBQTtBQUFBLE1BQUEsTUFBQTtBQUFBLE1BQUEsV0FBQTtBQUFBLE1BQUEsR0FBQTtBQUFBLE1BQUEsR0FBQTtBQUFBLE1BQUEsR0FBQTtBQUFBLE1BQUEsU0FBQTtBQUFBLE1BQUEsSUFBQTtBQUFBLE1BQUEsV0FBQTtBQUFBLE1BQUEsY0FBQTtBQUFBLE1BQUEsY0FBQTtBQUFBLE1BQUEsWUFBQTtBQUFBLE1BQUEsaUJBQUE7QUFBQSxNQUFBLElBQUE7QUFBQSxNQUFBO0FBQUEsSztBQTdJRixHO0FBRFksQ0FBZDs7ZUFpSmUsVyIsInNvdXJjZXNDb250ZW50IjpbIiMgUHJpbWl0aXZlcyBmb3IgdGhlIHNlcnZpY2UgUzMuICBUaGUgbWFpbiBlbnRpdGllcyBhcmUgYnVja2V0cyBhbmQgb2JqZWN0cy5cbiMgVGhpcyBmb2xsb3dzIHRoZSBuYW1pbmcgY29udmVudGlvbiB0aGF0IG1ldGhvZHMgdGhhdCB3b3JrIG9uIGJ1Y2tldHMgd2lsbCBiZVxuIyBwcmVmaXhlZCBcImJ1Y2tldCpcIiwgd2hlcmVhcyBvYmplY3QgbWV0aG9kcyB3aWxsIGhhdmUgbm8gcHJlZml4LlxuXG5pbXBvcnQge2NyZWF0ZVJlYWRTdHJlYW19IGZyb20gXCJmc1wiXG5pbXBvcnQgQ3J5cHRvIGZyb20gXCJjcnlwdG9cIlxuaW1wb3J0IHtzbGVlcCwgY2F0LCBtZXJnZSwgaXNTdHJpbmcsIGlzQnVmZmVyLCBpc09iamVjdH0gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQge3JlYWR9IGZyb20gXCJwYW5kYS1xdWlsbFwiXG5pbXBvcnQge01ldGhvZH0gZnJvbSBcInBhbmRhLWdlbmVyaWNzXCJcbmltcG9ydCBtaW1lIGZyb20gXCJtaW1lXCJcblxuaW1wb3J0IHtub3RGb3VuZH0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxubWQ1ID0gKGJ1ZmZlcikgLT5cbiAgQ3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShidWZmZXIpLmRpZ2VzdChcImJhc2U2NFwiKVxuXG5zM1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIHMzID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5TM1xuXG4gICAgYnVja2V0SGVhZCA9IGJ1Y2tldEV4aXN0cyA9IChuYW1lKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIGF3YWl0IHMzLmhlYWRCdWNrZXQgQnVja2V0OiBuYW1lXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGhlYWQgPSBleGlzdHMgPSAobmFtZSwga2V5KSAtPlxuICAgICAgdHJ5XG4gICAgICAgIGF3YWl0IHMzLmhlYWRPYmplY3Qge0J1Y2tldDogbmFtZSwgS2V5OiBrZXl9XG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGJ1Y2tldFRvdWNoID0gKG5hbWUpIC0+XG4gICAgICByZXR1cm4gdHJ1ZSBpZiBhd2FpdCBidWNrZXRFeGlzdHMgbmFtZVxuICAgICAgYXdhaXQgczMuY3JlYXRlQnVja2V0IHtCdWNrZXQ6IG5hbWV9XG4gICAgICBhd2FpdCBzbGVlcCAxNTAwMCAjIHJhY2UgY29uZGl0aW9uIHdpdGggUzMgQVBJLiAgV2FpdCB0byBiZSBhdmFpbGFibGUuXG5cbiAgICBwdXQgPSBNZXRob2QuY3JlYXRlIGRlZmF1bHQ6IChhcmdzLi4uKSAtPlxuICAgICAgY29uc29sZS5lcnJvciBcInN1bmRvZzpzMzpwdXQsIHVuYWJsZSB0byBtYXRjaCB0byBtZXRob2Qgb25cIiwgYXJnc1xuICAgICAgdGhyb3cgbmV3IEVycm9yKClcbiAgICAjIFB1dHRpbmcgYSBidWZmZXIgb2YgcmF3IGRhdGEgdG8gUzNcbiAgICBNZXRob2QuZGVmaW5lIHB1dCwgaXNTdHJpbmcsIGlzU3RyaW5nLCBpc0J1ZmZlciwgaXNTdHJpbmcsXG4gICAgKEJ1Y2tldCwgS2V5LCBidWZmZXIsIHR5cGUpIC0+XG4gICAgICBhd2FpdCBzMy5wdXRPYmplY3Qge1xuICAgICAgICBCdWNrZXQsIEtleSxcbiAgICAgICAgQ29udGVudFR5cGU6IHR5cGVcbiAgICAgICAgQ29udGVudE1ENTogbWQ1IGJ1ZmZlclxuICAgICAgICBCb2R5OiBidWZmZXJcbiAgICAgIH1cbiAgICAjIFB1dHRpbmcgYSBzdHJpbmcgdG8gUzNcbiAgICBNZXRob2QuZGVmaW5lIHB1dCwgaXNTdHJpbmcsIGlzU3RyaW5nLCBpc1N0cmluZywgaXNTdHJpbmcsXG4gICAgKEJ1Y2tldCwgS2V5LCB0ZXh0LCB0eXBlKSAtPlxuICAgICAgcHV0IEJ1Y2tldCwgS2V5LCBCdWZmZXIuZnJvbSh0ZXh0LCB0eXBlKSwgdHlwZVxuXG4gICAgIyBQdXR0aW5nIGEgZmlsZSBvbiBkaXNrIHRvIFMzXG4gICAgTWV0aG9kLmRlZmluZSBwdXQsIGlzU3RyaW5nLCBpc1N0cmluZywgaXNTdHJpbmcsXG4gICAgKEJ1Y2tldCwgS2V5LCBwYXRoKSAtPlxuICAgICAgcHV0IEJ1Y2tldCwgS2V5LCAocmVhZCBwYXRoLCBcImJ1ZmZlclwiKSwgKG1pbWUuZ2V0VHlwZSBwYXRoKVxuXG4gICAgIyBQdXR0aW5nIGEgZmlsZSBvbiBkaXNrIHRvIFMzLCB3aXRoIHR5cGUgb3ZlcnJpZGVcbiAgICBNZXRob2QuZGVmaW5lIHB1dCwgaXNTdHJpbmcsIGlzU3RyaW5nLCBpc09iamVjdCxcbiAgICAoQnVja2V0LCBLZXksIGZpbGUpIC0+XG4gICAgICBwdXQgQnVja2V0LCBLZXksIChyZWFkIGZpbGUucGF0aCwgXCJidWZmZXJcIiksIGZpbGUudHlwZVxuXG5cbiAgICBnZXQgPSAobmFtZSwga2V5LCBlbmNvZGluZz1cInV0ZjhcIikgLT5cbiAgICAgIHRyeVxuICAgICAgICB7Qm9keX0gPSBhd2FpdCBzMy5nZXRPYmplY3Qge0J1Y2tldDogbmFtZSwgS2V5OiBrZXl9XG4gICAgICAgIGlmIGVuY29kaW5nID09IFwiYmluYXJ5XCJcbiAgICAgICAgICBCb2R5XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBCb2R5LnRvU3RyaW5nIGVuY29kaW5nXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGRlbCA9IChuYW1lLCBrZXkpIC0+XG4gICAgICB0cnlcbiAgICAgICAgYXdhaXQgczMuZGVsZXRlT2JqZWN0IHtCdWNrZXQ6IG5hbWUsIEtleToga2V5fVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBub3RGb3VuZCBlXG5cbiAgICBidWNrZXREZWwgPSAobmFtZSkgLT5cbiAgICAgIHRyeVxuICAgICAgICBhd2FpdCBzMy5kZWxldGVCdWNrZXQgQnVja2V0OiBuYW1lXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGxpc3QgPSAobmFtZSwgaXRlbXM9W10sIG1hcmtlcikgLT5cbiAgICAgIHAgPSB7QnVja2V0OiBuYW1lLCBNYXhLZXlzOiAxMDAwfVxuICAgICAgcC5Db250aW51YXRpb25Ub2tlbiA9IG1hcmtlciBpZiBtYXJrZXJcblxuICAgICAge0lzVHJ1bmNhdGVkLCBDb250ZW50cywgTmV4dENvbnRpbnVhdGlvblRva2VufSA9IGF3YWl0IHMzLmxpc3RPYmplY3RzVjIgcFxuICAgICAgaWYgSXNUcnVuY2F0ZWRcbiAgICAgICAgaXRlbXMgPSBjYXQgaXRlbXMsIENvbnRlbnRzXG4gICAgICAgIGF3YWl0IGxpc3QgbmFtZSwgaXRlbXMsIE5leHRDb250aW51YXRpb25Ub2tlblxuICAgICAgZWxzZVxuICAgICAgICBjYXQgaXRlbXMsIENvbnRlbnRzXG5cbiAgICAjIFRPRE86IG1ha2UgdGhpcyBtb3JlIGVmZmljaWVudCBieSB0aHJvdHRsaW5nIHRvIFggY29ubmVjdGlvbnMgYXQgb25jZS4gQVdTXG4gICAgIyBvbmx5IHN1cHBvcnRzIE4gcmVxdWVzdHMgcGVyIHNlY29uZCBmcm9tIGFuIGFjY291bnQsIGFuZCBJIGRvbid0IHdhbnQgdGhpc1xuICAgICMgdG8gdmlvbGF0ZSB0aGF0IGxpbWl0LCBidXQgd2UgY2FuIGRvIGJldHRlciB0aGFuIG9uZSBhdCBhIHRpbWUuXG4gICAgYnVja2V0RW1wdHkgPSAobmFtZSkgLT5cbiAgICAgIGl0ZW1zID0gYXdhaXQgbGlzdCBuYW1lXG4gICAgICBhd2FpdCBkZWwgbmFtZSwgaS5LZXkgZm9yIGkgaW4gaXRlbXNcblxuICAgIGJ1Y2tldFB1dEFDTCA9IChwYXJhbWV0ZXJzKSAtPlxuICAgICAgYXdhaXQgczMucHV0QnVja2V0QWNsIHBhcmFtZXRlcnNcblxuICAgICMjIyMjXG4gICAgIyBNdWx0aXBhcnQgdXBsb2FkIGZ1bmN0aW9uc1xuICAgICMjIyMjXG4gICAgbXVsdGlwYXJ0U3RhcnQgPSAoQnVja2V0LCBLZXksIENvbnRlbnRUeXBlLCBvcHRpb25zPXt9KSAtPlxuICAgICAgYXdhaXQgczMuY3JlYXRlTXVsdGlwYXJ0VXBsb2FkIG1lcmdlIHtCdWNrZXQsIEtleSwgQ29udGVudFR5cGV9LCBvcHRpb25zXG5cbiAgICBtdWx0aXBhcnRBYm9ydCA9IChCdWNrZXQsIEtleSwgVXBsb2FkSWQpIC0+XG4gICAgICBhd2FpdCBzMy5hYm9ydE11bHRpcGFydFVwbG9hZCB7QnVja2V0LCBLZXksIFVwbG9hZElkfVxuXG4gICAgbXVsdGlwYXJ0Q29tcGxldGUgPSAoQnVja2V0LCBLZXksIFVwbG9hZElkLCBNdWx0aXBhcnRVcGxvYWQpIC0+XG4gICAgICBhd2FpdCBzMy5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCB7QnVja2V0LCBLZXksIFVwbG9hZElkLCBNdWx0aXBhcnRVcGxvYWR9XG5cbiAgICBtdWx0aXBhcnRQdXQgPSBNZXRob2QuY3JlYXRlIGRlZmF1bHQ6IChhcmdzLi4uKSAtPlxuICAgICAgY29uc29sZS5lcnJvciBcInN1bmRvZzpzMzptdWx0aXBhcnRQdXQsIHVuYWJsZSB0byBtYXRjaCBtZXRob2Qgb25cIiwgYXJnc1xuICAgICAgdGhyb3cgbmV3IEVycm9yKClcbiAgICAjIFB1dHRpbmcgYSBidWZmZXIgb2YgcmF3IGRhdGEgdG8gUzNcbiAgICBNZXRob2QuZGVmaW5lIG11bHRpcGFydFB1dCwgaXNTdHJpbmcsIGlzU3RyaW5nLCBpc1N0cmluZywgaXNTdHJpbmcsIGlzQnVmZmVyLCBpc1N0cmluZyxcbiAgICAoQnVja2V0LCBLZXksIFVwbG9hZElkLCBQYXJ0TnVtYmVyLCBidWZmZXIsIHR5cGUpIC0+XG4gICAgICBhd2FpdCBzMy51cGxvYWRQYXJ0IHtcbiAgICAgICAgQnVja2V0LCBLZXksIFVwbG9hZElkLCBQYXJ0TnVtYmVyLFxuICAgICAgICBDb250ZW50VHlwZTogdHlwZVxuICAgICAgICBDb250ZW50TUQ1OiBtZDUgYnVmZmVyXG4gICAgICAgIEJvZHk6IGJ1ZmZlclxuICAgICAgfVxuICAgICMgUHV0dGluZyBhIHN0cmluZyB0byBTM1xuICAgIE1ldGhvZC5kZWZpbmUgbXVsdGlwYXJ0UHV0LCBpc1N0cmluZywgaXNTdHJpbmcsIGlzU3RyaW5nLCBpc1N0cmluZywgaXNTdHJpbmcsIGlzU3RyaW5nLFxuICAgIChCdWNrZXQsIEtleSwgVXBsb2FkSWQsIFBhcnROdW1iZXIsIHRleHQsIHR5cGUpIC0+XG4gICAgICBtdWx0aXBhcnRQdXQgQnVja2V0LCBLZXksIFVwbG9hZElkLCBQYXJ0TnVtYmVyLFxuICAgICAgICBCdWZmZXIuZnJvbSh0ZXh0LCB0eXBlKSwgdHlwZVxuXG4gICAgIyBQdXR0aW5nIGEgZmlsZSBvbiBkaXNrIHRvIFMzXG4gICAgTWV0aG9kLmRlZmluZSBtdWx0aXBhcnRQdXQsIGlzU3RyaW5nLCBpc1N0cmluZywgaXNTdHJpbmcsIGlzU3RyaW5nLCBpc1N0cmluZ1xuICAgIChCdWNrZXQsIEtleSwgVXBsb2FkSWQsIFBhcnROdW1iZXIsIHBhdGgpIC0+XG4gICAgICBtdWx0aXBhcnRQdXQgQnVja2V0LCBLZXksIFVwbG9hZElkLCBQYXJ0TnVtYmVyLFxuICAgICAgICAocmVhZCBwYXRoLCBcImJ1ZmZlclwiKSwgKG1pbWUuZ2V0VHlwZSBwYXRoKVxuXG4gICAgIyBQdXR0aW5nIGEgZmlsZSBvbiBkaXNrIHRvIFMzLCB3aXRoIHR5cGUgb3ZlcnJpZGVcbiAgICBNZXRob2QuZGVmaW5lIG11bHRpcGFydFB1dCwgaXNTdHJpbmcsIGlzU3RyaW5nLCBpc1N0cmluZywgaXNTdHJpbmcsIGlzU3RyaW5nXG4gICAgKEJ1Y2tldCwgS2V5LCBVcGxvYWRJZCwgUGFydE51bWJlciwgcGF0aCkgLT5cbiAgICAgIG11bHRpcGFydFB1dCBCdWNrZXQsIEtleSwgVXBsb2FkSWQsIFBhcnROdW1iZXIsXG4gICAgICAgIChyZWFkIGZpbGUucGF0aCwgXCJidWZmZXJcIiksIGZpbGUudHlwZVxuXG4gICAgIyBTaWduaW5nIGEgVVJMIGdyYW50cyB0aGUgYmVhcmVyIHRoZSBhYmlsaXR5IHRvIHBlcmZvcm0gdGhlIGdpdmVuIGFjdGlvbiBhZ2FpbnN0IGFuIFMzIG9iamVjdCwgZXZlbiBpZiB0aGV5IGFyZSBub3QgeW91LlxuICAgIHNpZ24gPSAoYWN0aW9uLCBwYXJhbWV0ZXJzKSAtPlxuICAgICAgYXdhaXQgczMuZ2V0U2lnbmVkVXJsIGFjdGlvbiwgcGFyYW1ldGVyc1xuXG4gICAgc2lnblBvc3QgPSAocGFyYW1ldGVycykgLT5cbiAgICAgIGF3YWl0IHMzLmNyZWF0ZVByZXNpZ25lZFBvc3QgcGFyYW1ldGVyc1xuXG5cbiAgICB7YnVja2V0RXhpc3RzLCBleGlzdHMsIGJ1Y2tldFRvdWNoLCBwdXQsIGdldCwgZGVsLCBidWNrZXREZWwsIGxpc3QsIGJ1Y2tldEVtcHR5LCBtdWx0aXBhcnRTdGFydCwgbXVsdGlwYXJ0QWJvcnQsIG11bHRpcGFydFB1dCwgbXVsdGlwYXJ0Q29tcGxldGUsIHNpZ24sIHNpZ25Qb3N0fVxuXG5cbmV4cG9ydCBkZWZhdWx0IHMzUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=primitives/s3.coffee