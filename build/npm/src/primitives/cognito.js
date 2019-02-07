"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _pandaRiver = require("panda-river");

var _privateUtils = require("./private-utils");

var _lift = require("../lift");

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var cognitoPrimitive;

cognitoPrimitive = function (SDK) {
  var clientGet, clientHead, clientList, poolGet, poolHead, poolList;

  (function (configuration) {
    var cog;
    return cog = (0, _lift.applyConfiguration)(configuration, SDK.CognitoIdentityServiceProvider);
  });

  poolList = async function (current = [], token) {
    var NextToken, UserPools, params;
    params = {
      MaxResults: 60
    };

    if (token) {
      params.NextToken = token;
    }

    ({
      UserPools,
      NextToken
    } = await cog.listUserPools(params));
    current = (0, _pandaParchment.cat)(current, UserPools);

    if (NextToken) {
      return await poolList(current, NextToken);
    } else {
      return current;
    }
  };

  poolHead = async function (name) {
    var pool;
    [pool] = (0, _pandaRiver.collect)((0, _privateUtils.where)({
      Name: name
    }, (await poolList())));

    if (pool) {
      return pool;
    } else {
      return false;
    }
  };

  poolGet = async function (name) {
    var Id, UserPool;
    ({
      Id
    } = await poolHead(name));

    if (!Id) {
      return false;
    } else {
      ({
        UserPool
      } = await cog.describeUserPool({
        UserPoolId: Id
      }));
      return UserPool;
    }
  };

  clientList = async function (UserPoolId, current = [], token) {
    var NextToken, UserPoolClients, params;
    params = {
      UserPoolId,
      MaxResults: 60
    };

    if (token) {
      params.NextToken = token;
    }

    ({
      UserPoolClients,
      NextToken
    } = await cog.listUserPoolClients(params));
    current = (0, _pandaParchment.cat)(current, UserPoolClients);

    if (NextToken) {
      return await clientList(UserPoolId, current, NextToken);
    } else {
      return current;
    }
  };

  clientHead = async function (UserPoolOverload, ClientName) {
    var Id, UserPoolName, client;

    if (ClientName) {
      Id = UserPoolOverload;
    } else {
      ClientName = UserPoolName = UserPoolOverload;
      ({
        Id
      } = await poolHead(UserPoolName));
    }

    if (!Id) {
      return false;
    } else {
      [client] = (0, _pandaRiver.collect)((0, _privateUtils.where)({
        ClientName
      }, (await clientList(Id))));

      if (client) {
        return client;
      } else {
        return false;
      }
    }
  };

  clientGet = async function (userPoolName, clientName) {
    var ClientId, UserPoolClient, UserPoolId;
    clientName || (clientName = userPoolName);
    ({
      UserPoolId,
      ClientId
    } = await clientHead(userPoolName, clientName));

    if (ClientId) {
      ({
        UserPoolClient
      } = await cog.describeUserPoolClient({
        UserPoolId,
        ClientId
      }));
      return UserPoolClient;
    } else {
      return false;
    }
  };

  return {
    poolList,
    poolHead,
    poolGet,
    clientList,
    clientHead,
    clientGet
  };
};

var _default = cognitoPrimitive;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvY29nbml0by5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUxBO0FBQUEsSUFBQSxnQkFBQTs7QUFPQSxnQkFBQSxHQUFtQixVQUFBLEdBQUEsRUFBQTtBQUNqQixNQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsUUFBQTs7QUFBQSxHQUFBLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBO1dBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyw4QkFBQSxDO0FBRFIsR0FBQTs7QUFHQSxFQUFBLFFBQUEsR0FBVyxnQkFBQyxPQUFBLEdBQUQsRUFBQSxFQUFBLEtBQUEsRUFBQTtBQUNULFFBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVM7QUFBQSxNQUFBLFVBQUEsRUFBWTtBQUFaLEtBQVQ7O0FBQ0EsUUFBQSxLQUFBLEVBQUE7QUFBQSxNQUFBLE1BQU0sQ0FBTixTQUFBLEdBQUEsS0FBQTs7O0FBQ0EsS0FBQTtBQUFBLE1BQUEsU0FBQTtBQUFBLE1BQUE7QUFBQSxRQUF5QixNQUFNLEdBQUcsQ0FBSCxhQUFBLENBQS9CLE1BQStCLENBQS9CO0FBQ0EsSUFBQSxPQUFBLEdBQVUseUJBQUEsT0FBQSxFQUFBLFNBQUEsQ0FBVjs7QUFDQSxRQUFBLFNBQUEsRUFBQTtBQUNFLGFBQUEsTUFBTSxRQUFBLENBQUEsT0FBQSxFQURSLFNBQ1EsQ0FBTjtBQURGLEtBQUEsTUFBQTthQUFBLE87O0FBTFMsR0FBWDs7QUFVQSxFQUFBLFFBQUEsR0FBVyxnQkFBQSxJQUFBLEVBQUE7QUFDVCxRQUFBLElBQUE7QUFBQSxLQUFBLElBQUEsSUFBUyx5QkFBUSx5QkFBTTtBQUFBLE1BQUEsSUFBQSxFQUFNO0FBQU4sS0FB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Q29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIENvZ25pdG8uICBUaGUgYmFzZSBlbnRpdHkgaXMgdGhlIFwidXNlclwiLiAgTWV0aG9kcyB0aGF0IGFjdCBvbiBvdGhlciBlbnRpdGllcywgbGlrZSBwb29scyBvciBjbGllbnRzIGFyZSBwcmVmaXhlZCBhcyBzdWNoLlxuXG5pbXBvcnQge2NhdH0gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQge2NvbGxlY3R9IGZyb20gXCJwYW5kYS1yaXZlclwiXG5pbXBvcnQge3doZXJlfSBmcm9tIFwiLi9wcml2YXRlLXV0aWxzXCJcbmltcG9ydCB7YXBwbHlDb25maWd1cmF0aW9ufSBmcm9tIFwiLi4vbGlmdFwiXG5cbmNvZ25pdG9QcmltaXRpdmUgPSAoU0RLKSAtPlxuICAoY29uZmlndXJhdGlvbikgLT5cbiAgICBjb2cgPSBhcHBseUNvbmZpZ3VyYXRpb24gY29uZmlndXJhdGlvbiwgU0RLLkNvZ25pdG9JZGVudGl0eVNlcnZpY2VQcm92aWRlclxuXG4gIHBvb2xMaXN0ID0gKGN1cnJlbnQ9W10sIHRva2VuKSAtPlxuICAgIHBhcmFtcyA9IE1heFJlc3VsdHM6IDYwXG4gICAgcGFyYW1zLk5leHRUb2tlbiA9IHRva2VuIGlmIHRva2VuXG4gICAge1VzZXJQb29scywgTmV4dFRva2VufSA9IGF3YWl0IGNvZy5saXN0VXNlclBvb2xzIHBhcmFtc1xuICAgIGN1cnJlbnQgPSBjYXQgY3VycmVudCwgVXNlclBvb2xzXG4gICAgaWYgTmV4dFRva2VuXG4gICAgICBhd2FpdCBwb29sTGlzdCBjdXJyZW50LCBOZXh0VG9rZW5cbiAgICBlbHNlXG4gICAgICBjdXJyZW50XG5cbiAgcG9vbEhlYWQgPSAobmFtZSkgLT5cbiAgICBbcG9vbF0gPSBjb2xsZWN0IHdoZXJlIE5hbWU6IG5hbWUsIGF3YWl0IHBvb2xMaXN0KClcbiAgICBpZiBwb29sIHRoZW4gcG9vbCBlbHNlIGZhbHNlXG5cbiAgcG9vbEdldCA9IChuYW1lKSAtPlxuICAgIHtJZH0gPSBhd2FpdCBwb29sSGVhZCBuYW1lXG4gICAgaWYgIUlkXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBlbHNlXG4gICAgICB7VXNlclBvb2x9ID0gYXdhaXQgY29nLmRlc2NyaWJlVXNlclBvb2wgVXNlclBvb2xJZDogSWRcbiAgICAgIFVzZXJQb29sXG5cbiAgY2xpZW50TGlzdCA9IChVc2VyUG9vbElkLCBjdXJyZW50PVtdLCB0b2tlbikgLT5cbiAgICBwYXJhbXMgPSB7XG4gICAgICBVc2VyUG9vbElkXG4gICAgICBNYXhSZXN1bHRzOiA2MFxuICAgIH1cbiAgICBwYXJhbXMuTmV4dFRva2VuID0gdG9rZW4gaWYgdG9rZW5cbiAgICB7VXNlclBvb2xDbGllbnRzLCBOZXh0VG9rZW59ID0gYXdhaXQgY29nLmxpc3RVc2VyUG9vbENsaWVudHMgcGFyYW1zXG4gICAgY3VycmVudCA9IGNhdCBjdXJyZW50LCBVc2VyUG9vbENsaWVudHNcbiAgICBpZiBOZXh0VG9rZW5cbiAgICAgIGF3YWl0IGNsaWVudExpc3QgVXNlclBvb2xJZCwgY3VycmVudCwgTmV4dFRva2VuXG4gICAgZWxzZVxuICAgICAgY3VycmVudFxuXG4gIGNsaWVudEhlYWQgPSAoVXNlclBvb2xPdmVybG9hZCwgQ2xpZW50TmFtZSkgLT5cbiAgICBpZiBDbGllbnROYW1lXG4gICAgICBJZCA9IFVzZXJQb29sT3ZlcmxvYWRcbiAgICBlbHNlXG4gICAgICBDbGllbnROYW1lID0gVXNlclBvb2xOYW1lID0gVXNlclBvb2xPdmVybG9hZFxuICAgICAge0lkfSA9IGF3YWl0IHBvb2xIZWFkIFVzZXJQb29sTmFtZVxuXG4gICAgaWYgIUlkXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBlbHNlXG4gICAgICBbY2xpZW50XSA9IGNvbGxlY3Qgd2hlcmUge0NsaWVudE5hbWV9LCBhd2FpdCBjbGllbnRMaXN0KElkKVxuICAgICAgaWYgY2xpZW50IHRoZW4gY2xpZW50IGVsc2UgZmFsc2VcblxuICBjbGllbnRHZXQgPSAodXNlclBvb2xOYW1lLCBjbGllbnROYW1lKSAtPlxuICAgIGNsaWVudE5hbWUgfHw9IHVzZXJQb29sTmFtZVxuICAgIHtVc2VyUG9vbElkLCBDbGllbnRJZH0gPSBhd2FpdCBjbGllbnRIZWFkIHVzZXJQb29sTmFtZSwgY2xpZW50TmFtZVxuICAgIGlmIENsaWVudElkXG4gICAgICB7VXNlclBvb2xDbGllbnR9ID0gYXdhaXQgY29nLmRlc2NyaWJlVXNlclBvb2xDbGllbnQge1VzZXJQb29sSWQsIENsaWVudElkfVxuICAgICAgVXNlclBvb2xDbGllbnRcbiAgICBlbHNlXG4gICAgICBmYWxzZVxuXG5cbiAge3Bvb2xMaXN0LCBwb29sSGVhZCwgcG9vbEdldCwgY2xpZW50TGlzdCwgY2xpZW50SGVhZCwgY2xpZW50R2V0fVxuXG5cbmV4cG9ydCBkZWZhdWx0IGNvZ25pdG9QcmltaXRpdmVcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sundog/src/primitives/cognito.coffee