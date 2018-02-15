"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var cognitoPrimative,
    indexOf = [].indexOf;

cognitoPrimative = function (_AWS) {
  var clientGet, clientGetHead, clientList, cog, frictionless, poolGet, poolGetHead, poolList;
  cog = _AWS.CognitoIdentityServiceProvider;
  poolList = (() => {
    var _ref = _asyncToGenerator(function* (current = [], token) {
      var NextToken, UserPools, params;
      params = {
        MaxResults: 60
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

    return function poolList() {
      return _ref.apply(this, arguments);
    };
  })();
  poolGetHead = (() => {
    var _ref2 = _asyncToGenerator(function* (name) {
      var pool;
      [pool] = (0, _fairmont.collect)((0, _fairmont.where)({
        Name: name
      }, (yield poolList())));
      if (pool) {
        return pool;
      } else {
        return false;
      }
    });

    return function poolGetHead(_x) {
      return _ref2.apply(this, arguments);
    };
  })();
  poolGet = (() => {
    var _ref3 = _asyncToGenerator(function* (name) {
      var Id, UserPool;
      ({ Id } = yield poolGetHead(name));
      if (!Id) {
        return false;
      } else {
        ({ UserPool } = yield cog.describeUserPool({
          UserPoolId: Id
        }));
        return UserPool;
      }
    });

    return function poolGet(_x2) {
      return _ref3.apply(this, arguments);
    };
  })();
  clientList = (() => {
    var _ref4 = _asyncToGenerator(function* (UserPoolId, current = [], token) {
      var NextToken, UserPoolClients, params;
      params = {
        UserPoolId,
        MaxResults: 60
      };
      if (token) {
        params.NextToken = token;
      }
      ({ UserPoolClients, NextToken } = yield cog.listUserPoolClients(params));
      current = (0, _fairmont.cat)(current, UserPoolClients);
      if (NextToken) {
        return yield clientList(UserPoolId, current, NextToken);
      } else {
        return current;
      }
    });

    return function clientList(_x3) {
      return _ref4.apply(this, arguments);
    };
  })();
  clientGetHead = (() => {
    var _ref5 = _asyncToGenerator(function* (UserPoolOverload, ClientName) {
      var Id, UserPoolName, client;
      if (ClientName) {
        Id = UserPoolOverload;
      } else {
        ClientName = UserPoolName = UserPoolOverload;
        ({ Id } = yield poolGetHead(UserPoolName));
      }
      if (!Id) {
        return false;
      } else {
        [client] = (0, _fairmont.collect)((0, _fairmont.where)({ ClientName }, (yield clientList(Id))));
        if (client) {
          return client;
        } else {
          return false;
        }
      }
    });

    return function clientGetHead(_x4, _x5) {
      return _ref5.apply(this, arguments);
    };
  })();
  clientGet = (() => {
    var _ref6 = _asyncToGenerator(function* (userPoolName, clientName) {
      var ClientId, UserPoolClient, UserPoolId;
      clientName || (clientName = userPoolName);
      ({ UserPoolId, ClientId } = yield clientGetHead(userPoolName, clientName));
      if (ClientId) {
        ({ UserPoolClient } = yield cog.describeUserPoolClient({ UserPoolId, ClientId }));
        return UserPoolClient;
      } else {
        return false;
      }
    });

    return function clientGet(_x6, _x7) {
      return _ref6.apply(this, arguments);
    };
  })();
  frictionless = function () {
    var assignAttributes, assignOptional, assignRequired, create;
    assignRequired = function (config) {
      return [{
        Name: "email",
        Value: config.email || ""
      }, {
        Name: "phone_number",
        Value: config.phone_number || ""
      }];
    };
    assignOptional = function (config, attributes) {
      var avoid, n, v;
      avoid = ["username", "email", "phone_number"];
      for (n in config) {
        v = config[n];
        if (indexOf.call(avoid, n) < 0) {
          attributes.push({
            Name: n,
            Value: v
          });
        }
      }
      return attributes;
    };
    assignAttributes = function (config) {
      return assignOptional(config, assignRequired(config));
    };
    create = (() => {
      var _ref7 = _asyncToGenerator(function* (id, attributes) {
        var params;
        params = {
          UserPoolId: id,
          Username: attributes.username,
          UserAttributes: assignAttributes(attributes)
        };
        params.DesiredDeliveryMediums = [];
        if (attributes.phone_number) {
          params.DesiredDeliveryMediums.push("SMS");
        }
        if (attributes.email) {
          params.DesiredDeliveryMediums.push("EMAIL");
        }
        return yield cog.adminCreateUser(params);
      });

      return function create(_x8, _x9) {
        return _ref7.apply(this, arguments);
      };
    })();
    return { create };
  }();
  return { frictionless, poolList, poolGetHead, poolGet, clientList, clientGetHead, clientGet };
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