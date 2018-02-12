"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var cognitoPrimative;

cognitoPrimative = function (_AWS) {
  var cog, poolGet, poolList;
  cog = _AWS.Cognito;
  poolList = (() => {
    var _ref = _asyncToGenerator(function* (current, token) {
      var NextToken, UserPools, params;
      params = {
        MaxResults: 100
      };
      if (token) {
        params.NextToken = token;
      }
      ({ UserPools, NextToken } = yield cog.listUserPools(params));
      current = (0, _fairmont.cat)(current, UserPools);
      if (NextToken) {
        return yield poolList(current, NextToken);
      } else {
        return current;
      }
    });

    return function poolList(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
  poolGet = (() => {
    var _ref2 = _asyncToGenerator(function* (name) {
      var Id;
      ({ Id } = collect(where({
        Name: name
      }, (yield poolList()))));
      if (!Id) {
        return false;
      } else {
        return yield cog.describeUserPool({
          UserPoolId: Id
        });
      }
    });

    return function poolGet(_x3) {
      return _ref2.apply(this, arguments);
    };
  })();
  return { poolList, poolGet };
};

// exists = curry (name, key) ->
//   try
//     await s3.headObject {Bucket: name, Key: key}
//     true
//   catch e
//     notFound e

// bucketTouch = (name) ->
//   return true if await bucketExists name
//   await s3.createBucket {Bucket: name}
//   await sleep 15000 # race condition with S3 API.  Wait to be available.

// put = curry (name, key, data, filetype) ->
//   if filetype
//     # here, data is stringified data.
//     content = body = new Buffer data
//   else
//     # here, data is a path to file.
//     filetype = mime.lookup data
//     body = createReadStream data
//     content =
//       if "text" in mime.lookup(data)
//         await read data
//       else
//         await read data, "buffer"

//   params =
//     Bucket: name
//     Key: key
//     ContentType: filetype
//     ContentMD5: new Buffer(md5(content), "hex").toString('base64')
//     Body: body

//   await s3.putObject params

// get = curry (name, key, encoding="utf8") ->
//   try
//     {Body} = await s3.getObject {Bucket: name, Key: key}
//     Body.toString encoding
//   catch e
//     notFound e

// del = curry (name, key) ->
//   try
//     await s3.deleteObject {Bucket: name, Key: key}
//   catch e
//     notFound e

// bucketDel = (name) ->
//   try
//     await s3.deleteBucket Bucket: name
//   catch e
//     notFound e

// list = curry (name, items=[], marker) ->
//   p = {Bucket: name, MaxKeys: 1000}
//   p.ContinuationToken = marker if marker

//   {IsTruncated, Contents, NextContinuationToken} = await s3.listObjectsV2 p
//   if IsTruncated
//     items = cat items, Contents
//     await list name, items, NextContinuationToken
//   else
//     cat items, Contents

// # TODO: make this more efficient by throttling to X connections at once. AWS
// # only supports N requests per second from an account, and I don't want this
// # to violate that limit, but we can do better than one at a time.
// bucketEmpty = (name) ->
//   items = await list name
//   await del name, i.Key for i in items
exports.default = cognitoPrimative;