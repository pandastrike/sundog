"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fairmont = require("fairmont");

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var cognitoPrimative;

cognitoPrimative = function (_AWS) {
  var clientGet, clientHead, clientList, cog, poolGet, poolHead, poolList;
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
  poolHead = (() => {
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

    return function poolHead(_x) {
      return _ref2.apply(this, arguments);
    };
  })();
  poolGet = (() => {
    var _ref3 = _asyncToGenerator(function* (name) {
      var Id, UserPool;
      ({ Id } = yield poolHead(name));
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
  clientHead = (() => {
    var _ref5 = _asyncToGenerator(function* (UserPoolOverload, ClientName) {
      var Id, UserPoolName, client;
      if (ClientName) {
        Id = UserPoolOverload;
      } else {
        ClientName = UserPoolName = UserPoolOverload;
        ({ Id } = yield poolHead(UserPoolName));
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

    return function clientHead(_x4, _x5) {
      return _ref5.apply(this, arguments);
    };
  })();
  clientGet = (() => {
    var _ref6 = _asyncToGenerator(function* (userPoolName, clientName) {
      var ClientId, UserPoolClient, UserPoolId;
      clientName || (clientName = userPoolName);
      ({ UserPoolId, ClientId } = yield clientHead(userPoolName, clientName));
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
  return { poolList, poolHead, poolGet, clientList, clientHead, clientGet };
};

exports.default = cognitoPrimative;