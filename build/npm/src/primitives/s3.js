"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _pandaParchment = require("panda-parchment");

var _pandaQuill = require("panda-quill");

var _mime = _interopRequireDefault(require("mime"));

var _utils = require("./utils");

var _lift = require("../lift");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Primitives for the service S3.  The main entities are buckets and objects.
// This follows the naming convention that methods that work on buckets will be
// prefixed "bucket*", whereas object methods will have no prefix.
var md5,
    s3Primitive,
    indexOf = [].indexOf;

md5 = function (string) {
  return Crypto.createHash('md5').update(string, 'utf-8').digest("hex");
};

s3Primitive = function (SDK) {
  return function (configuration) {
    var bucketDel, bucketEmpty, bucketExists, bucketPutACL, bucketTouch, del, exists, get, list, multipartAbort, multipartComplete, multipartPut, multipartStart, put, s3, sign, signPost;
    s3 = (0, _lift.applyConfiguration)(configuration, SDK.S3);

    bucketExists = async function (name) {
      var e;

      try {
        await s3.headBucket({
          Bucket: name
        });
        return true;
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    };

    exists = (0, _pandaParchment.curry)(async function (name, key) {
      var e;

      try {
        await s3.headObject({
          Bucket: name,
          Key: key
        });
        return true;
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    });

    bucketTouch = async function (name) {
      if (await bucketExists(name)) {
        return true;
      }

      await s3.createBucket({
        Bucket: name
      });
      return await (0, _pandaParchment.sleep)(15000); // race condition with S3 API.  Wait to be available.
    };

    put = (0, _pandaParchment.curry)(async function (Bucket, Key, data, filetype) {
      var body, content;

      if (filetype) {
        // here, data is stringified data.
        content = body = Buffer.from(data);
      } else {
        // here, data is a path to file.
        filetype = _mime.default.getType(data);
        body = (0, _fs.createReadStream)(data);
        content = indexOf.call(_mime.default.getType(data), "text") >= 0 ? await (0, _pandaQuill.read)(data) : await (0, _pandaQuill.read)(data, "buffer");
      }

      return await s3.putObject({
        Bucket,
        Key,
        ContentType: filetype,
        ContentMD5: Buffer.from(md5(content), "hex").toString('base64'),
        Body: body
      });
    });
    get = (0, _pandaParchment.curry)(async function (name, key, encoding = "utf8") {
      var Body, e;

      try {
        ({
          Body
        } = await s3.getObject({
          Bucket: name,
          Key: key
        }));
        return Body.toString(encoding);
      } catch (error) {
        e = error;
        return (0, _utils.notFound)(e);
      }
    });
    del = (0, _pandaParchment.curry)(async function (name, key) {
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
    });

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

    list = (0, _pandaParchment.curry)(async function (name, items = [], marker) {
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
    }); // TODO: make this more efficient by throttling to X connections at once. AWS
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

    multipartPut = async function (Bucket, Key, UploadId, PartNumber, part, filetype) {
      var body, content;

      if (filetype) {
        // here, data is stringified data.
        content = body = Buffer.from(part);
      } else {
        // here, data is a path to file.
        filetype = _mime.default.getType(part);
        body = (0, _fs.createReadStream)(part);
        content = indexOf.call(filetype, "text") >= 0 ? await (0, _pandaQuill.read)(part) : await (0, _pandaQuill.read)(part, "buffer");
      }

      return await s3.uploadPart({
        Bucket,
        Key,
        UploadId,
        PartNumber,
        ContentType: filetype,
        ContentMD5: Buffer.from(md5(content), "hex").toString('base64'),
        Body: body
      });
    }; // Signing a URL grants the bearer the ability to perform the given action against an S3 object, even if they are not you.


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvczMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFJQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7OztBQVZBOzs7QUFBQSxJQUFBLEdBQUE7QUFBQSxJQUFBLFdBQUE7QUFBQSxJQUFBLE9BQUEsR0FBQSxHQUFBLE9BQUE7O0FBWUEsR0FBQSxHQUFNLFVBQUEsTUFBQSxFQUFBO1NBQ0osTUFBTSxDQUFOLFVBQUEsQ0FBQSxLQUFBLEVBQUEsTUFBQSxDQUFBLE1BQUEsRUFBQSxPQUFBLEVBQUEsTUFBQSxDQUFBLEtBQUEsQztBQURJLENBQU47O0FBR0EsV0FBQSxHQUFjLFVBQUEsR0FBQSxFQUFBO1NBQ1osVUFBQSxhQUFBLEVBQUE7QUFDRSxRQUFBLFNBQUEsRUFBQSxXQUFBLEVBQUEsWUFBQSxFQUFBLFlBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLGNBQUEsRUFBQSxpQkFBQSxFQUFBLFlBQUEsRUFBQSxjQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxJQUFBLEVBQUEsUUFBQTtBQUFBLElBQUEsRUFBQSxHQUFLLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyxFQUFBLENBQUw7O0FBRUEsSUFBQSxZQUFBLEdBQWUsZ0JBQUEsSUFBQSxFQUFBO0FBQ2IsVUFBQSxDQUFBOztBQUFBLFVBQUE7QUFDRSxjQUFNLEVBQUUsQ0FBRixVQUFBLENBQWM7QUFBQSxVQUFBLE1BQUEsRUFBUTtBQUFSLFNBQWQsQ0FBTjtlQURGLEk7QUFBQSxPQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFHTSxRQUFBLENBQUEsR0FBQSxLQUFBO2VBQ0oscUJBSkYsQ0FJRSxDOztBQUxXLEtBQWY7O0FBT0EsSUFBQSxNQUFBLEdBQVMsMkJBQU0sZ0JBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQTtBQUNiLFVBQUEsQ0FBQTs7QUFBQSxVQUFBO0FBQ0UsY0FBTSxFQUFFLENBQUYsVUFBQSxDQUFjO0FBQUMsVUFBQSxNQUFBLEVBQUQsSUFBQTtBQUFlLFVBQUEsR0FBQSxFQUFLO0FBQXBCLFNBQWQsQ0FBTjtlQURGLEk7QUFBQSxPQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFHTSxRQUFBLENBQUEsR0FBQSxLQUFBO2VBQ0oscUJBSkYsQ0FJRSxDOztBQUxLLEtBQUEsQ0FBVDs7QUFPQSxJQUFBLFdBQUEsR0FBYyxnQkFBQSxJQUFBLEVBQUE7QUFDWixVQUFlLE1BQU0sWUFBQSxDQUFyQixJQUFxQixDQUFyQixFQUFBO0FBQUEsZUFBQSxJQUFBOzs7QUFDQSxZQUFNLEVBQUUsQ0FBRixZQUFBLENBQWdCO0FBQUMsUUFBQSxNQUFBLEVBQVE7QUFBVCxPQUFoQixDQUFOO0FBQ0EsYUFBQSxNQUFNLDJCQUhNLEtBR04sQ0FBTixDQUhZLENBQUE7QUFBQSxLQUFkOztBQUtBLElBQUEsR0FBQSxHQUFNLDJCQUFNLGdCQUFBLE1BQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQTtBQUNWLFVBQUEsSUFBQSxFQUFBLE9BQUE7O0FBQUEsVUFBQSxRQUFBLEVBQUE7O0FBRUUsUUFBQSxPQUFBLEdBQVUsSUFBQSxHQUFPLE1BQU0sQ0FBTixJQUFBLENBRm5CLElBRW1CLENBQWpCO0FBRkYsT0FBQSxNQUFBOztBQUtFLFFBQUEsUUFBQSxHQUFXLGNBQUEsT0FBQSxDQUFBLElBQUEsQ0FBWDtBQUNBLFFBQUEsSUFBQSxHQUFPLDBCQUFBLElBQUEsQ0FBUDtBQUNBLFFBQUEsT0FBQSxHQUNLLE9BQUEsQ0FBQSxJQUFBLENBQVUsY0FBQSxPQUFBLENBQVYsSUFBVSxDQUFWLEVBQUEsTUFBQSxLQUFILENBQUcsR0FDRCxNQUFNLHNCQURSLElBQ1EsQ0FETCxHQUdELE1BQU0sc0JBQUEsSUFBQSxFQVhaLFFBV1ksQ0FKVjs7O0FBTUYsYUFBQSxNQUFNLEVBQUUsQ0FBRixTQUFBLENBQWE7QUFBQSxRQUFBLE1BQUE7QUFBQSxRQUFBLEdBQUE7QUFFakIsUUFBQSxXQUFBLEVBRmlCLFFBQUE7QUFHakIsUUFBQSxVQUFBLEVBQVksTUFBTSxDQUFOLElBQUEsQ0FBWSxHQUFBLENBQVosT0FBWSxDQUFaLEVBQUEsS0FBQSxFQUFBLFFBQUEsQ0FISyxRQUdMLENBSEs7QUFJakIsUUFBQSxJQUFBLEVBQU07QUFKVyxPQUFiLENBQU47QUFkSSxLQUFBLENBQU47QUFxQkEsSUFBQSxHQUFBLEdBQU0sMkJBQU0sZ0JBQUEsSUFBQSxFQUFBLEdBQUEsRUFBWSxRQUFBLEdBQVosTUFBQSxFQUFBO0FBQ1YsVUFBQSxJQUFBLEVBQUEsQ0FBQTs7QUFBQSxVQUFBO0FBQ0UsU0FBQTtBQUFBLFVBQUE7QUFBQSxZQUFTLE1BQU0sRUFBRSxDQUFGLFNBQUEsQ0FBYTtBQUFDLFVBQUEsTUFBQSxFQUFELElBQUE7QUFBZSxVQUFBLEdBQUEsRUFBSztBQUFwQixTQUFiLENBQWY7ZUFDQSxJQUFJLENBQUosUUFBQSxDQUZGLFFBRUUsQztBQUZGLE9BQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUdNLFFBQUEsQ0FBQSxHQUFBLEtBQUE7ZUFDSixxQkFKRixDQUlFLEM7O0FBTEUsS0FBQSxDQUFOO0FBT0EsSUFBQSxHQUFBLEdBQU0sMkJBQU0sZ0JBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQTtBQUNWLFVBQUEsQ0FBQTs7QUFBQSxVQUFBO0FBQ0UsZUFBQSxNQUFNLEVBQUUsQ0FBRixZQUFBLENBQWdCO0FBQUMsVUFBQSxNQUFBLEVBQUQsSUFBQTtBQUFlLFVBQUEsR0FBQSxFQUFLO0FBQXBCLFNBQWhCLENBQU47QUFERixPQUFBLENBQUEsT0FBQSxLQUFBLEVBQUE7QUFFTSxRQUFBLENBQUEsR0FBQSxLQUFBO2VBQ0oscUJBSEYsQ0FHRSxDOztBQUpFLEtBQUEsQ0FBTjs7QUFNQSxJQUFBLFNBQUEsR0FBWSxnQkFBQSxJQUFBLEVBQUE7QUFDVixVQUFBLENBQUE7O0FBQUEsVUFBQTtBQUNFLGVBQUEsTUFBTSxFQUFFLENBQUYsWUFBQSxDQUFnQjtBQUFBLFVBQUEsTUFBQSxFQUFRO0FBQVIsU0FBaEIsQ0FBTjtBQURGLE9BQUEsQ0FBQSxPQUFBLEtBQUEsRUFBQTtBQUVNLFFBQUEsQ0FBQSxHQUFBLEtBQUE7ZUFDSixxQkFIRixDQUdFLEM7O0FBSlEsS0FBWjs7QUFNQSxJQUFBLElBQUEsR0FBTywyQkFBTSxnQkFBQSxJQUFBLEVBQU8sS0FBQSxHQUFQLEVBQUEsRUFBQSxNQUFBLEVBQUE7QUFDWCxVQUFBLFFBQUEsRUFBQSxXQUFBLEVBQUEscUJBQUEsRUFBQSxDQUFBO0FBQUEsTUFBQSxDQUFBLEdBQUk7QUFBQyxRQUFBLE1BQUEsRUFBRCxJQUFBO0FBQWUsUUFBQSxPQUFBLEVBQVM7QUFBeEIsT0FBSjs7QUFDQSxVQUFBLE1BQUEsRUFBQTtBQUFBLFFBQUEsQ0FBQyxDQUFELGlCQUFBLEdBQUEsTUFBQTs7O0FBRUEsT0FBQTtBQUFBLFFBQUEsV0FBQTtBQUFBLFFBQUEsUUFBQTtBQUFBLFFBQUE7QUFBQSxVQUFpRCxNQUFNLEVBQUUsQ0FBRixhQUFBLENBQXZELENBQXVELENBQXZEOztBQUNBLFVBQUEsV0FBQSxFQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEseUJBQUEsS0FBQSxFQUFBLFFBQUEsQ0FBUjtBQUNBLGVBQUEsTUFBTSxJQUFBLENBQUEsSUFBQSxFQUFBLEtBQUEsRUFGUixxQkFFUSxDQUFOO0FBRkYsT0FBQSxNQUFBO2VBSUUseUJBQUEsS0FBQSxFQUpGLFFBSUUsQzs7QUF0RUosS0E2RE8sQ0FBUCxDQTlERixDOzs7O0FBNEVFLElBQUEsV0FBQSxHQUFjLGdCQUFBLElBQUEsRUFBQTtBQUNaLFVBQUEsQ0FBQSxFQUFBLEtBQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUE7QUFBQSxNQUFBLEtBQUEsR0FBUSxNQUFNLElBQUEsQ0FBTixJQUFNLENBQWQ7QUFDc0IsTUFBQSxPQUFBLEdBQUEsRUFBQTs7QUFBQSxXQUFBLENBQUEsR0FBQSxDQUFBLEVBQUEsR0FBQSxHQUFBLEtBQUEsQ0FBQSxNQUFBLEVBQUEsQ0FBQSxHQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsRUFBQTs7Z0JBQXRCLEksRUFBQSxNQUFNLEdBQUEsQ0FBQSxJQUFBLEVBQVUsQ0FBQyxDQUFqQixHQUFNLEM7QUFBZ0I7OztBQUZWLEtBQWQ7O0FBSUEsSUFBQSxZQUFBLEdBQWUsZ0JBQUEsVUFBQSxFQUFBO0FBQ2IsYUFBQSxNQUFNLEVBQUUsQ0FBRixZQUFBLENBQU4sVUFBTSxDQUFOO0FBaEZGLEtBK0VBLENBaEZGLEM7Ozs7O0FBc0ZFLElBQUEsY0FBQSxHQUFpQixnQkFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLFdBQUEsRUFBMkIsT0FBQSxHQUEzQixFQUFBLEVBQUE7QUFDZixhQUFBLE1BQU0sRUFBRSxDQUFGLHFCQUFBLENBQXlCLDJCQUFNO0FBQUEsUUFBQSxNQUFBO0FBQUEsUUFBQSxHQUFBO0FBQU4sUUFBQTtBQUFNLE9BQU4sRUFBL0IsT0FBK0IsQ0FBekIsQ0FBTjtBQURlLEtBQWpCOztBQUdBLElBQUEsY0FBQSxHQUFpQixnQkFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLFFBQUEsRUFBQTtBQUNmLGFBQUEsTUFBTSxFQUFFLENBQUYsb0JBQUEsQ0FBd0I7QUFBQSxRQUFBLE1BQUE7QUFBQSxRQUFBLEdBQUE7QUFBOUIsUUFBQTtBQUE4QixPQUF4QixDQUFOO0FBRGUsS0FBakI7O0FBR0EsSUFBQSxpQkFBQSxHQUFvQixnQkFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLFFBQUEsRUFBQSxlQUFBLEVBQUE7QUFDbEIsYUFBQSxNQUFNLEVBQUUsQ0FBRix1QkFBQSxDQUEyQjtBQUFBLFFBQUEsTUFBQTtBQUFBLFFBQUEsR0FBQTtBQUFBLFFBQUEsUUFBQTtBQUFqQyxRQUFBO0FBQWlDLE9BQTNCLENBQU47QUFEa0IsS0FBcEI7O0FBR0EsSUFBQSxZQUFBLEdBQWUsZ0JBQUEsTUFBQSxFQUFBLEdBQUEsRUFBQSxRQUFBLEVBQUEsVUFBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUE7QUFDYixVQUFBLElBQUEsRUFBQSxPQUFBOztBQUFBLFVBQUEsUUFBQSxFQUFBOztBQUVFLFFBQUEsT0FBQSxHQUFVLElBQUEsR0FBTyxNQUFNLENBQU4sSUFBQSxDQUZuQixJQUVtQixDQUFqQjtBQUZGLE9BQUEsTUFBQTs7QUFLRSxRQUFBLFFBQUEsR0FBVyxjQUFBLE9BQUEsQ0FBQSxJQUFBLENBQVg7QUFDQSxRQUFBLElBQUEsR0FBTywwQkFBQSxJQUFBLENBQVA7QUFDQSxRQUFBLE9BQUEsR0FDSyxPQUFBLENBQUEsSUFBQSxDQUFBLFFBQUEsRUFBQSxNQUFBLEtBQUgsQ0FBRyxHQUNELE1BQU0sc0JBRFIsSUFDUSxDQURMLEdBR0QsTUFBTSxzQkFBQSxJQUFBLEVBWFosUUFXWSxDQUpWOzs7QUFNRixhQUFBLE1BQU0sRUFBRSxDQUFGLFVBQUEsQ0FBYztBQUFBLFFBQUEsTUFBQTtBQUFBLFFBQUEsR0FBQTtBQUFBLFFBQUEsUUFBQTtBQUFBLFFBQUEsVUFBQTtBQUVsQixRQUFBLFdBQUEsRUFGa0IsUUFBQTtBQUdsQixRQUFBLFVBQUEsRUFBWSxNQUFNLENBQU4sSUFBQSxDQUFZLEdBQUEsQ0FBWixPQUFZLENBQVosRUFBQSxLQUFBLEVBQUEsUUFBQSxDQUhNLFFBR04sQ0FITTtBQUlsQixRQUFBLElBQUEsRUFBTTtBQUpZLE9BQWQsQ0FBTjtBQTVHRixLQThGQSxDQS9GRixDOzs7QUFzSEUsSUFBQSxJQUFBLEdBQU8sZ0JBQUEsTUFBQSxFQUFBLFVBQUEsRUFBQTtBQUNMLGFBQUEsTUFBTSxFQUFFLENBQUYsWUFBQSxDQUFBLE1BQUEsRUFBTixVQUFNLENBQU47QUFESyxLQUFQOztBQUdBLElBQUEsUUFBQSxHQUFXLGdCQUFBLFVBQUEsRUFBQTtBQUNULGFBQUEsTUFBTSxFQUFFLENBQUYsbUJBQUEsQ0FBTixVQUFNLENBQU47QUFEUyxLQUFYOztXQUlBO0FBQUEsTUFBQSxZQUFBO0FBQUEsTUFBQSxNQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxHQUFBO0FBQUEsTUFBQSxTQUFBO0FBQUEsTUFBQSxJQUFBO0FBQUEsTUFBQSxXQUFBO0FBQUEsTUFBQSxjQUFBO0FBQUEsTUFBQSxjQUFBO0FBQUEsTUFBQSxZQUFBO0FBQUEsTUFBQSxpQkFBQTtBQUFBLE1BQUEsSUFBQTtBQUFBLE1BQUE7QUFBQSxLO0FBN0hGLEc7QUFEWSxDQUFkOztlQWlJZSxXIiwic291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBTMy4gIFRoZSBtYWluIGVudGl0aWVzIGFyZSBidWNrZXRzIGFuZCBvYmplY3RzLlxuIyBUaGlzIGZvbGxvd3MgdGhlIG5hbWluZyBjb252ZW50aW9uIHRoYXQgbWV0aG9kcyB0aGF0IHdvcmsgb24gYnVja2V0cyB3aWxsIGJlXG4jIHByZWZpeGVkIFwiYnVja2V0KlwiLCB3aGVyZWFzIG9iamVjdCBtZXRob2RzIHdpbGwgaGF2ZSBubyBwcmVmaXguXG5cbmltcG9ydCB7Y3JlYXRlUmVhZFN0cmVhbX0gZnJvbSBcImZzXCJcbmltcG9ydCB7Y3VycnksIHNsZWVwLCBjYXQsIG1lcmdlfSBmcm9tIFwicGFuZGEtcGFyY2htZW50XCJcbmltcG9ydCB7cmVhZH0gZnJvbSBcInBhbmRhLXF1aWxsXCJcbmltcG9ydCBtaW1lIGZyb20gXCJtaW1lXCJcblxuaW1wb3J0IHtub3RGb3VuZH0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxubWQ1ID0gKHN0cmluZykgLT5cbiAgQ3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShzdHJpbmcsICd1dGYtOCcpLmRpZ2VzdChcImhleFwiKVxuXG5zM1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIHMzID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5TM1xuXG4gICAgYnVja2V0RXhpc3RzID0gKG5hbWUpIC0+XG4gICAgICB0cnlcbiAgICAgICAgYXdhaXQgczMuaGVhZEJ1Y2tldCBCdWNrZXQ6IG5hbWVcbiAgICAgICAgdHJ1ZVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBub3RGb3VuZCBlXG5cbiAgICBleGlzdHMgPSBjdXJyeSAobmFtZSwga2V5KSAtPlxuICAgICAgdHJ5XG4gICAgICAgIGF3YWl0IHMzLmhlYWRPYmplY3Qge0J1Y2tldDogbmFtZSwgS2V5OiBrZXl9XG4gICAgICAgIHRydWVcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZVxuXG4gICAgYnVja2V0VG91Y2ggPSAobmFtZSkgLT5cbiAgICAgIHJldHVybiB0cnVlIGlmIGF3YWl0IGJ1Y2tldEV4aXN0cyBuYW1lXG4gICAgICBhd2FpdCBzMy5jcmVhdGVCdWNrZXQge0J1Y2tldDogbmFtZX1cbiAgICAgIGF3YWl0IHNsZWVwIDE1MDAwICMgcmFjZSBjb25kaXRpb24gd2l0aCBTMyBBUEkuICBXYWl0IHRvIGJlIGF2YWlsYWJsZS5cblxuICAgIHB1dCA9IGN1cnJ5IChCdWNrZXQsIEtleSwgZGF0YSwgZmlsZXR5cGUpIC0+XG4gICAgICBpZiBmaWxldHlwZVxuICAgICAgICAjIGhlcmUsIGRhdGEgaXMgc3RyaW5naWZpZWQgZGF0YS5cbiAgICAgICAgY29udGVudCA9IGJvZHkgPSBCdWZmZXIuZnJvbSBkYXRhXG4gICAgICBlbHNlXG4gICAgICAgICMgaGVyZSwgZGF0YSBpcyBhIHBhdGggdG8gZmlsZS5cbiAgICAgICAgZmlsZXR5cGUgPSBtaW1lLmdldFR5cGUgZGF0YVxuICAgICAgICBib2R5ID0gY3JlYXRlUmVhZFN0cmVhbSBkYXRhXG4gICAgICAgIGNvbnRlbnQgPVxuICAgICAgICAgIGlmIFwidGV4dFwiIGluIG1pbWUuZ2V0VHlwZShkYXRhKVxuICAgICAgICAgICAgYXdhaXQgcmVhZCBkYXRhXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXdhaXQgcmVhZCBkYXRhLCBcImJ1ZmZlclwiXG5cbiAgICAgIGF3YWl0IHMzLnB1dE9iamVjdCB7XG4gICAgICAgIEJ1Y2tldCwgS2V5LFxuICAgICAgICBDb250ZW50VHlwZTogZmlsZXR5cGVcbiAgICAgICAgQ29udGVudE1ENTogQnVmZmVyLmZyb20obWQ1KGNvbnRlbnQpLCBcImhleFwiKS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgQm9keTogYm9keVxuICAgICAgfVxuXG4gICAgZ2V0ID0gY3VycnkgKG5hbWUsIGtleSwgZW5jb2Rpbmc9XCJ1dGY4XCIpIC0+XG4gICAgICB0cnlcbiAgICAgICAge0JvZHl9ID0gYXdhaXQgczMuZ2V0T2JqZWN0IHtCdWNrZXQ6IG5hbWUsIEtleToga2V5fVxuICAgICAgICBCb2R5LnRvU3RyaW5nIGVuY29kaW5nXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGRlbCA9IGN1cnJ5IChuYW1lLCBrZXkpIC0+XG4gICAgICB0cnlcbiAgICAgICAgYXdhaXQgczMuZGVsZXRlT2JqZWN0IHtCdWNrZXQ6IG5hbWUsIEtleToga2V5fVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBub3RGb3VuZCBlXG5cbiAgICBidWNrZXREZWwgPSAobmFtZSkgLT5cbiAgICAgIHRyeVxuICAgICAgICBhd2FpdCBzMy5kZWxldGVCdWNrZXQgQnVja2V0OiBuYW1lXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGxpc3QgPSBjdXJyeSAobmFtZSwgaXRlbXM9W10sIG1hcmtlcikgLT5cbiAgICAgIHAgPSB7QnVja2V0OiBuYW1lLCBNYXhLZXlzOiAxMDAwfVxuICAgICAgcC5Db250aW51YXRpb25Ub2tlbiA9IG1hcmtlciBpZiBtYXJrZXJcblxuICAgICAge0lzVHJ1bmNhdGVkLCBDb250ZW50cywgTmV4dENvbnRpbnVhdGlvblRva2VufSA9IGF3YWl0IHMzLmxpc3RPYmplY3RzVjIgcFxuICAgICAgaWYgSXNUcnVuY2F0ZWRcbiAgICAgICAgaXRlbXMgPSBjYXQgaXRlbXMsIENvbnRlbnRzXG4gICAgICAgIGF3YWl0IGxpc3QgbmFtZSwgaXRlbXMsIE5leHRDb250aW51YXRpb25Ub2tlblxuICAgICAgZWxzZVxuICAgICAgICBjYXQgaXRlbXMsIENvbnRlbnRzXG5cbiAgICAjIFRPRE86IG1ha2UgdGhpcyBtb3JlIGVmZmljaWVudCBieSB0aHJvdHRsaW5nIHRvIFggY29ubmVjdGlvbnMgYXQgb25jZS4gQVdTXG4gICAgIyBvbmx5IHN1cHBvcnRzIE4gcmVxdWVzdHMgcGVyIHNlY29uZCBmcm9tIGFuIGFjY291bnQsIGFuZCBJIGRvbid0IHdhbnQgdGhpc1xuICAgICMgdG8gdmlvbGF0ZSB0aGF0IGxpbWl0LCBidXQgd2UgY2FuIGRvIGJldHRlciB0aGFuIG9uZSBhdCBhIHRpbWUuXG4gICAgYnVja2V0RW1wdHkgPSAobmFtZSkgLT5cbiAgICAgIGl0ZW1zID0gYXdhaXQgbGlzdCBuYW1lXG4gICAgICBhd2FpdCBkZWwgbmFtZSwgaS5LZXkgZm9yIGkgaW4gaXRlbXNcblxuICAgIGJ1Y2tldFB1dEFDTCA9IChwYXJhbWV0ZXJzKSAtPlxuICAgICAgYXdhaXQgczMucHV0QnVja2V0QWNsIHBhcmFtZXRlcnNcblxuICAgICMjIyMjXG4gICAgIyBNdWx0aXBhcnQgdXBsb2FkIGZ1bmN0aW9uc1xuICAgICMjIyMjXG4gICAgbXVsdGlwYXJ0U3RhcnQgPSAoQnVja2V0LCBLZXksIENvbnRlbnRUeXBlLCBvcHRpb25zPXt9KSAtPlxuICAgICAgYXdhaXQgczMuY3JlYXRlTXVsdGlwYXJ0VXBsb2FkIG1lcmdlIHtCdWNrZXQsIEtleSwgQ29udGVudFR5cGV9LCBvcHRpb25zXG5cbiAgICBtdWx0aXBhcnRBYm9ydCA9IChCdWNrZXQsIEtleSwgVXBsb2FkSWQpIC0+XG4gICAgICBhd2FpdCBzMy5hYm9ydE11bHRpcGFydFVwbG9hZCB7QnVja2V0LCBLZXksIFVwbG9hZElkfVxuXG4gICAgbXVsdGlwYXJ0Q29tcGxldGUgPSAoQnVja2V0LCBLZXksIFVwbG9hZElkLCBNdWx0aXBhcnRVcGxvYWQpIC0+XG4gICAgICBhd2FpdCBzMy5jb21wbGV0ZU11bHRpcGFydFVwbG9hZCB7QnVja2V0LCBLZXksIFVwbG9hZElkLCBNdWx0aXBhcnRVcGxvYWR9XG5cbiAgICBtdWx0aXBhcnRQdXQgPSAoQnVja2V0LCBLZXksIFVwbG9hZElkLCBQYXJ0TnVtYmVyLCBwYXJ0LCBmaWxldHlwZSkgLT5cbiAgICAgIGlmIGZpbGV0eXBlXG4gICAgICAgICMgaGVyZSwgZGF0YSBpcyBzdHJpbmdpZmllZCBkYXRhLlxuICAgICAgICBjb250ZW50ID0gYm9keSA9IEJ1ZmZlci5mcm9tIHBhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgIyBoZXJlLCBkYXRhIGlzIGEgcGF0aCB0byBmaWxlLlxuICAgICAgICBmaWxldHlwZSA9IG1pbWUuZ2V0VHlwZSBwYXJ0XG4gICAgICAgIGJvZHkgPSBjcmVhdGVSZWFkU3RyZWFtIHBhcnRcbiAgICAgICAgY29udGVudCA9XG4gICAgICAgICAgaWYgXCJ0ZXh0XCIgaW4gZmlsZXR5cGVcbiAgICAgICAgICAgIGF3YWl0IHJlYWQgcGFydFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGF3YWl0IHJlYWQgcGFydCwgXCJidWZmZXJcIlxuXG4gICAgICBhd2FpdCBzMy51cGxvYWRQYXJ0IHtcbiAgICAgICAgQnVja2V0LCBLZXksIFVwbG9hZElkLCBQYXJ0TnVtYmVyLFxuICAgICAgICBDb250ZW50VHlwZTogZmlsZXR5cGVcbiAgICAgICAgQ29udGVudE1ENTogQnVmZmVyLmZyb20obWQ1KGNvbnRlbnQpLCBcImhleFwiKS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgQm9keTogYm9keVxuICAgICAgfVxuXG5cbiAgICAjIFNpZ25pbmcgYSBVUkwgZ3JhbnRzIHRoZSBiZWFyZXIgdGhlIGFiaWxpdHkgdG8gcGVyZm9ybSB0aGUgZ2l2ZW4gYWN0aW9uIGFnYWluc3QgYW4gUzMgb2JqZWN0LCBldmVuIGlmIHRoZXkgYXJlIG5vdCB5b3UuXG4gICAgc2lnbiA9IChhY3Rpb24sIHBhcmFtZXRlcnMpIC0+XG4gICAgICBhd2FpdCBzMy5nZXRTaWduZWRVcmwgYWN0aW9uLCBwYXJhbWV0ZXJzXG5cbiAgICBzaWduUG9zdCA9IChwYXJhbWV0ZXJzKSAtPlxuICAgICAgYXdhaXQgczMuY3JlYXRlUHJlc2lnbmVkUG9zdCBwYXJhbWV0ZXJzXG5cblxuICAgIHtidWNrZXRFeGlzdHMsIGV4aXN0cywgYnVja2V0VG91Y2gsIHB1dCwgZ2V0LCBkZWwsIGJ1Y2tldERlbCwgbGlzdCwgYnVja2V0RW1wdHksIG11bHRpcGFydFN0YXJ0LCBtdWx0aXBhcnRBYm9ydCwgbXVsdGlwYXJ0UHV0LCBtdWx0aXBhcnRDb21wbGV0ZSwgc2lnbiwgc2lnblBvc3R9XG5cblxuZXhwb3J0IGRlZmF1bHQgczNQcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=primitives/s3.coffee