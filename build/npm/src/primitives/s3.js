"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = require("fs");

var _crypto = _interopRequireDefault(require("crypto"));

var _pandaGarden = require("panda-garden");

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
  return _crypto.default.createHash('md5').update(string, 'utf-8').digest("hex");
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

    exists = (0, _pandaGarden.curry)(async function (name, key) {
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

    put = (0, _pandaGarden.curry)(async function (Bucket, Key, data, filetype) {
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
    get = (0, _pandaGarden.curry)(async function (name, key, encoding = "utf8") {
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
    });
    del = (0, _pandaGarden.curry)(async function (name, key) {
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

    list = (0, _pandaGarden.curry)(async function (name, items = [], marker) {
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
//# sourceMappingURL=data:application/json;base64,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QUFBLEdBQUE7QUFBQSxNQUFBLFNBQUE7QUFBQSxNQUFBLElBQUE7QUFBQSxNQUFBLFdBQUE7QUFBQSxNQUFBLGNBQUE7QUFBQSxNQUFBLGNBQUE7QUFBQSxNQUFBLFlBQUE7QUFBQSxNQUFBLGlCQUFBO0FBQUEsTUFBQSxJQUFBO0FBQUEsTUFBQTtBQUFBLEs7QUFoSUYsRztBQURZLENBQWQ7O2VBb0llLFciLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIFMzLiAgVGhlIG1haW4gZW50aXRpZXMgYXJlIGJ1Y2tldHMgYW5kIG9iamVjdHMuXG4jIFRoaXMgZm9sbG93cyB0aGUgbmFtaW5nIGNvbnZlbnRpb24gdGhhdCBtZXRob2RzIHRoYXQgd29yayBvbiBidWNrZXRzIHdpbGwgYmVcbiMgcHJlZml4ZWQgXCJidWNrZXQqXCIsIHdoZXJlYXMgb2JqZWN0IG1ldGhvZHMgd2lsbCBoYXZlIG5vIHByZWZpeC5cblxuaW1wb3J0IHtjcmVhdGVSZWFkU3RyZWFtfSBmcm9tIFwiZnNcIlxuaW1wb3J0IENyeXB0byBmcm9tIFwiY3J5cHRvXCJcbmltcG9ydCB7Y3Vycnl9IGZyb20gXCJwYW5kYS1nYXJkZW5cIlxuaW1wb3J0IHtzbGVlcCwgY2F0LCBtZXJnZX0gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQge3JlYWR9IGZyb20gXCJwYW5kYS1xdWlsbFwiXG5pbXBvcnQgbWltZSBmcm9tIFwibWltZVwiXG5cbmltcG9ydCB7bm90Rm91bmR9IGZyb20gXCIuL3V0aWxzXCJcbmltcG9ydCB7YXBwbHlDb25maWd1cmF0aW9ufSBmcm9tIFwiLi4vbGlmdFwiXG5cbm1kNSA9IChzdHJpbmcpIC0+XG4gIENyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoc3RyaW5nLCAndXRmLTgnKS5kaWdlc3QoXCJoZXhcIilcblxuczNQcmltaXRpdmUgPSAoU0RLKSAtPlxuICAoY29uZmlndXJhdGlvbikgLT5cbiAgICBzMyA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuUzNcblxuICAgIGJ1Y2tldEV4aXN0cyA9IChuYW1lKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIGF3YWl0IHMzLmhlYWRCdWNrZXQgQnVja2V0OiBuYW1lXG4gICAgICAgIHRydWVcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZVxuXG4gICAgZXhpc3RzID0gY3VycnkgKG5hbWUsIGtleSkgLT5cbiAgICAgIHRyeVxuICAgICAgICBhd2FpdCBzMy5oZWFkT2JqZWN0IHtCdWNrZXQ6IG5hbWUsIEtleToga2V5fVxuICAgICAgICB0cnVlXG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGJ1Y2tldFRvdWNoID0gKG5hbWUpIC0+XG4gICAgICByZXR1cm4gdHJ1ZSBpZiBhd2FpdCBidWNrZXRFeGlzdHMgbmFtZVxuICAgICAgYXdhaXQgczMuY3JlYXRlQnVja2V0IHtCdWNrZXQ6IG5hbWV9XG4gICAgICBhd2FpdCBzbGVlcCAxNTAwMCAjIHJhY2UgY29uZGl0aW9uIHdpdGggUzMgQVBJLiAgV2FpdCB0byBiZSBhdmFpbGFibGUuXG5cbiAgICBwdXQgPSBjdXJyeSAoQnVja2V0LCBLZXksIGRhdGEsIGZpbGV0eXBlKSAtPlxuICAgICAgaWYgZmlsZXR5cGVcbiAgICAgICAgIyBoZXJlLCBkYXRhIGlzIHN0cmluZ2lmaWVkIGRhdGEuXG4gICAgICAgIGNvbnRlbnQgPSBib2R5ID0gQnVmZmVyLmZyb20gZGF0YVxuICAgICAgZWxzZVxuICAgICAgICAjIGhlcmUsIGRhdGEgaXMgYSBwYXRoIHRvIGZpbGUuXG4gICAgICAgIGZpbGV0eXBlID0gbWltZS5nZXRUeXBlIGRhdGFcbiAgICAgICAgYm9keSA9IGNyZWF0ZVJlYWRTdHJlYW0gZGF0YVxuICAgICAgICBjb250ZW50ID1cbiAgICAgICAgICBpZiBcInRleHRcIiBpbiBtaW1lLmdldFR5cGUoZGF0YSlcbiAgICAgICAgICAgIGF3YWl0IHJlYWQgZGF0YVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGF3YWl0IHJlYWQgZGF0YSwgXCJidWZmZXJcIlxuXG4gICAgICBhd2FpdCBzMy5wdXRPYmplY3Qge1xuICAgICAgICBCdWNrZXQsIEtleSxcbiAgICAgICAgQ29udGVudFR5cGU6IGZpbGV0eXBlXG4gICAgICAgIENvbnRlbnRNRDU6IEJ1ZmZlci5mcm9tKG1kNShjb250ZW50KSwgXCJoZXhcIikudG9TdHJpbmcoJ2Jhc2U2NCcpXG4gICAgICAgIEJvZHk6IGJvZHlcbiAgICAgIH1cblxuICAgIGdldCA9IGN1cnJ5IChuYW1lLCBrZXksIGVuY29kaW5nPVwidXRmOFwiKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIHtCb2R5fSA9IGF3YWl0IHMzLmdldE9iamVjdCB7QnVja2V0OiBuYW1lLCBLZXk6IGtleX1cbiAgICAgICAgaWYgZW5jb2RpbmcgPT0gXCJiaW5hcnlcIlxuICAgICAgICAgIEJvZHlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEJvZHkudG9TdHJpbmcgZW5jb2RpbmdcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZVxuXG4gICAgZGVsID0gY3VycnkgKG5hbWUsIGtleSkgLT5cbiAgICAgIHRyeVxuICAgICAgICBhd2FpdCBzMy5kZWxldGVPYmplY3Qge0J1Y2tldDogbmFtZSwgS2V5OiBrZXl9XG4gICAgICBjYXRjaCBlXG4gICAgICAgIG5vdEZvdW5kIGVcblxuICAgIGJ1Y2tldERlbCA9IChuYW1lKSAtPlxuICAgICAgdHJ5XG4gICAgICAgIGF3YWl0IHMzLmRlbGV0ZUJ1Y2tldCBCdWNrZXQ6IG5hbWVcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgbm90Rm91bmQgZVxuXG4gICAgbGlzdCA9IGN1cnJ5IChuYW1lLCBpdGVtcz1bXSwgbWFya2VyKSAtPlxuICAgICAgcCA9IHtCdWNrZXQ6IG5hbWUsIE1heEtleXM6IDEwMDB9XG4gICAgICBwLkNvbnRpbnVhdGlvblRva2VuID0gbWFya2VyIGlmIG1hcmtlclxuXG4gICAgICB7SXNUcnVuY2F0ZWQsIENvbnRlbnRzLCBOZXh0Q29udGludWF0aW9uVG9rZW59ID0gYXdhaXQgczMubGlzdE9iamVjdHNWMiBwXG4gICAgICBpZiBJc1RydW5jYXRlZFxuICAgICAgICBpdGVtcyA9IGNhdCBpdGVtcywgQ29udGVudHNcbiAgICAgICAgYXdhaXQgbGlzdCBuYW1lLCBpdGVtcywgTmV4dENvbnRpbnVhdGlvblRva2VuXG4gICAgICBlbHNlXG4gICAgICAgIGNhdCBpdGVtcywgQ29udGVudHNcblxuICAgICMgVE9ETzogbWFrZSB0aGlzIG1vcmUgZWZmaWNpZW50IGJ5IHRocm90dGxpbmcgdG8gWCBjb25uZWN0aW9ucyBhdCBvbmNlLiBBV1NcbiAgICAjIG9ubHkgc3VwcG9ydHMgTiByZXF1ZXN0cyBwZXIgc2Vjb25kIGZyb20gYW4gYWNjb3VudCwgYW5kIEkgZG9uJ3Qgd2FudCB0aGlzXG4gICAgIyB0byB2aW9sYXRlIHRoYXQgbGltaXQsIGJ1dCB3ZSBjYW4gZG8gYmV0dGVyIHRoYW4gb25lIGF0IGEgdGltZS5cbiAgICBidWNrZXRFbXB0eSA9IChuYW1lKSAtPlxuICAgICAgaXRlbXMgPSBhd2FpdCBsaXN0IG5hbWVcbiAgICAgIGF3YWl0IGRlbCBuYW1lLCBpLktleSBmb3IgaSBpbiBpdGVtc1xuXG4gICAgYnVja2V0UHV0QUNMID0gKHBhcmFtZXRlcnMpIC0+XG4gICAgICBhd2FpdCBzMy5wdXRCdWNrZXRBY2wgcGFyYW1ldGVyc1xuXG4gICAgIyMjIyNcbiAgICAjIE11bHRpcGFydCB1cGxvYWQgZnVuY3Rpb25zXG4gICAgIyMjIyNcbiAgICBtdWx0aXBhcnRTdGFydCA9IChCdWNrZXQsIEtleSwgQ29udGVudFR5cGUsIG9wdGlvbnM9e30pIC0+XG4gICAgICBhd2FpdCBzMy5jcmVhdGVNdWx0aXBhcnRVcGxvYWQgbWVyZ2Uge0J1Y2tldCwgS2V5LCBDb250ZW50VHlwZX0sIG9wdGlvbnNcblxuICAgIG11bHRpcGFydEFib3J0ID0gKEJ1Y2tldCwgS2V5LCBVcGxvYWRJZCkgLT5cbiAgICAgIGF3YWl0IHMzLmFib3J0TXVsdGlwYXJ0VXBsb2FkIHtCdWNrZXQsIEtleSwgVXBsb2FkSWR9XG5cbiAgICBtdWx0aXBhcnRDb21wbGV0ZSA9IChCdWNrZXQsIEtleSwgVXBsb2FkSWQsIE11bHRpcGFydFVwbG9hZCkgLT5cbiAgICAgIGF3YWl0IHMzLmNvbXBsZXRlTXVsdGlwYXJ0VXBsb2FkIHtCdWNrZXQsIEtleSwgVXBsb2FkSWQsIE11bHRpcGFydFVwbG9hZH1cblxuICAgIG11bHRpcGFydFB1dCA9IChCdWNrZXQsIEtleSwgVXBsb2FkSWQsIFBhcnROdW1iZXIsIHBhcnQsIGZpbGV0eXBlKSAtPlxuICAgICAgaWYgZmlsZXR5cGVcbiAgICAgICAgIyBoZXJlLCBkYXRhIGlzIHN0cmluZ2lmaWVkIGRhdGEuXG4gICAgICAgIGNvbnRlbnQgPSBib2R5ID0gQnVmZmVyLmZyb20gcGFydFxuICAgICAgZWxzZVxuICAgICAgICAjIGhlcmUsIGRhdGEgaXMgYSBwYXRoIHRvIGZpbGUuXG4gICAgICAgIGZpbGV0eXBlID0gbWltZS5nZXRUeXBlIHBhcnRcbiAgICAgICAgYm9keSA9IGNyZWF0ZVJlYWRTdHJlYW0gcGFydFxuICAgICAgICBjb250ZW50ID1cbiAgICAgICAgICBpZiBcInRleHRcIiBpbiBmaWxldHlwZVxuICAgICAgICAgICAgYXdhaXQgcmVhZCBwYXJ0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgYXdhaXQgcmVhZCBwYXJ0LCBcImJ1ZmZlclwiXG5cbiAgICAgIGF3YWl0IHMzLnVwbG9hZFBhcnQge1xuICAgICAgICBCdWNrZXQsIEtleSwgVXBsb2FkSWQsIFBhcnROdW1iZXIsXG4gICAgICAgIENvbnRlbnRUeXBlOiBmaWxldHlwZVxuICAgICAgICBDb250ZW50TUQ1OiBCdWZmZXIuZnJvbShtZDUoY29udGVudCksIFwiaGV4XCIpLnRvU3RyaW5nKCdiYXNlNjQnKVxuICAgICAgICBCb2R5OiBib2R5XG4gICAgICB9XG5cblxuICAgICMgU2lnbmluZyBhIFVSTCBncmFudHMgdGhlIGJlYXJlciB0aGUgYWJpbGl0eSB0byBwZXJmb3JtIHRoZSBnaXZlbiBhY3Rpb24gYWdhaW5zdCBhbiBTMyBvYmplY3QsIGV2ZW4gaWYgdGhleSBhcmUgbm90IHlvdS5cbiAgICBzaWduID0gKGFjdGlvbiwgcGFyYW1ldGVycykgLT5cbiAgICAgIGF3YWl0IHMzLmdldFNpZ25lZFVybCBhY3Rpb24sIHBhcmFtZXRlcnNcblxuICAgIHNpZ25Qb3N0ID0gKHBhcmFtZXRlcnMpIC0+XG4gICAgICBhd2FpdCBzMy5jcmVhdGVQcmVzaWduZWRQb3N0IHBhcmFtZXRlcnNcblxuXG4gICAge2J1Y2tldEV4aXN0cywgZXhpc3RzLCBidWNrZXRUb3VjaCwgcHV0LCBnZXQsIGRlbCwgYnVja2V0RGVsLCBsaXN0LCBidWNrZXRFbXB0eSwgbXVsdGlwYXJ0U3RhcnQsIG11bHRpcGFydEFib3J0LCBtdWx0aXBhcnRQdXQsIG11bHRpcGFydENvbXBsZXRlLCBzaWduLCBzaWduUG9zdH1cblxuXG5leHBvcnQgZGVmYXVsdCBzM1ByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=primitives/s3.coffee