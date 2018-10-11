"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

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
    [pool] = (0, _pandaParchment.collect)((0, _pandaParchment.where)({
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
      [client] = (0, _pandaParchment.collect)((0, _pandaParchment.where)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvY29nbml0by5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUhBO0FBQUEsSUFBQSxnQkFBQTs7QUFLQSxnQkFBQSxHQUFtQixVQUFBLEdBQUEsRUFBQTtBQUNqQixNQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsUUFBQTs7QUFBQSxHQUFBLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBO1dBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyw4QkFBQSxDO0FBRFIsR0FBQTs7QUFHQSxFQUFBLFFBQUEsR0FBVyxnQkFBQyxPQUFBLEdBQUQsRUFBQSxFQUFBLEtBQUEsRUFBQTtBQUNULFFBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVM7QUFBQSxNQUFBLFVBQUEsRUFBWTtBQUFaLEtBQVQ7O0FBQ0EsUUFBQSxLQUFBLEVBQUE7QUFBQSxNQUFBLE1BQU0sQ0FBTixTQUFBLEdBQUEsS0FBQTs7O0FBQ0EsS0FBQTtBQUFBLE1BQUEsU0FBQTtBQUFBLE1BQUE7QUFBQSxRQUF5QixNQUFNLEdBQUcsQ0FBSCxhQUFBLENBQS9CLE1BQStCLENBQS9CO0FBQ0EsSUFBQSxPQUFBLEdBQVUseUJBQUEsT0FBQSxFQUFBLFNBQUEsQ0FBVjs7QUFDQSxRQUFBLFNBQUEsRUFBQTtBQUNFLGFBQUEsTUFBTSxRQUFBLENBQUEsT0FBQSxFQURSLFNBQ1EsQ0FBTjtBQURGLEtBQUEsTUFBQTthQUFBLE87O0FBTFMsR0FBWDs7QUFVQSxFQUFBLFFBQUEsR0FBVyxnQkFBQSxJQUFBLEVBQUE7QUFDVCxRQUFBLElBQUE7QUFBQSxLQUFBLElBQUEsSUFBUyw2QkFBUSwyQkFBTTtBQUFBLE1BQUEsSUFBQSxFQUFNO0FBQU4sS0FBTixHQUFrQixNQUFNLFFBQWhDLEVBQVEsRUFBUixDQUFUOztBQUNBLFFB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Z25pdG8uICBUaGUgYmFzZSBlbnRpdHkgaXMgdGhlIFwidXNlclwiLiAgTWV0aG9kcyB0aGF0IGFjdCBvbiBvdGhlciBlbnRpdGllcywgbGlrZSBwb29scyBvciBjbGllbnRzIGFyZSBwcmVmaXhlZCBhcyBzdWNoLlxuXG5pbXBvcnQge2NhdCwgY29sbGVjdCwgd2hlcmV9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxuY29nbml0b1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIGNvZyA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuQ29nbml0b0lkZW50aXR5U2VydmljZVByb3ZpZGVyXG5cbiAgcG9vbExpc3QgPSAoY3VycmVudD1bXSwgdG9rZW4pIC0+XG4gICAgcGFyYW1zID0gTWF4UmVzdWx0czogNjBcbiAgICBwYXJhbXMuTmV4dFRva2VuID0gdG9rZW4gaWYgdG9rZW5cbiAgICB7VXNlclBvb2xzLCBOZXh0VG9rZW59ID0gYXdhaXQgY29nLmxpc3RVc2VyUG9vbHMgcGFyYW1zXG4gICAgY3VycmVudCA9IGNhdCBjdXJyZW50LCBVc2VyUG9vbHNcbiAgICBpZiBOZXh0VG9rZW5cbiAgICAgIGF3YWl0IHBvb2xMaXN0IGN1cnJlbnQsIE5leHRUb2tlblxuICAgIGVsc2VcbiAgICAgIGN1cnJlbnRcblxuICBwb29sSGVhZCA9IChuYW1lKSAtPlxuICAgIFtwb29sXSA9IGNvbGxlY3Qgd2hlcmUgTmFtZTogbmFtZSwgYXdhaXQgcG9vbExpc3QoKVxuICAgIGlmIHBvb2wgdGhlbiBwb29sIGVsc2UgZmFsc2VcblxuICBwb29sR2V0ID0gKG5hbWUpIC0+XG4gICAge0lkfSA9IGF3YWl0IHBvb2xIZWFkIG5hbWVcbiAgICBpZiAhSWRcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGVsc2VcbiAgICAgIHtVc2VyUG9vbH0gPSBhd2FpdCBjb2cuZGVzY3JpYmVVc2VyUG9vbCBVc2VyUG9vbElkOiBJZFxuICAgICAgVXNlclBvb2xcblxuICBjbGllbnRMaXN0ID0gKFVzZXJQb29sSWQsIGN1cnJlbnQ9W10sIHRva2VuKSAtPlxuICAgIHBhcmFtcyA9IHtcbiAgICAgIFVzZXJQb29sSWRcbiAgICAgIE1heFJlc3VsdHM6IDYwXG4gICAgfVxuICAgIHBhcmFtcy5OZXh0VG9rZW4gPSB0b2tlbiBpZiB0b2tlblxuICAgIHtVc2VyUG9vbENsaWVudHMsIE5leHRUb2tlbn0gPSBhd2FpdCBjb2cubGlzdFVzZXJQb29sQ2xpZW50cyBwYXJhbXNcbiAgICBjdXJyZW50ID0gY2F0IGN1cnJlbnQsIFVzZXJQb29sQ2xpZW50c1xuICAgIGlmIE5leHRUb2tlblxuICAgICAgYXdhaXQgY2xpZW50TGlzdCBVc2VyUG9vbElkLCBjdXJyZW50LCBOZXh0VG9rZW5cbiAgICBlbHNlXG4gICAgICBjdXJyZW50XG5cbiAgY2xpZW50SGVhZCA9IChVc2VyUG9vbE92ZXJsb2FkLCBDbGllbnROYW1lKSAtPlxuICAgIGlmIENsaWVudE5hbWVcbiAgICAgIElkID0gVXNlclBvb2xPdmVybG9hZFxuICAgIGVsc2VcbiAgICAgIENsaWVudE5hbWUgPSBVc2VyUG9vbE5hbWUgPSBVc2VyUG9vbE92ZXJsb2FkXG4gICAgICB7SWR9ID0gYXdhaXQgcG9vbEhlYWQgVXNlclBvb2xOYW1lXG5cbiAgICBpZiAhSWRcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGVsc2VcbiAgICAgIFtjbGllbnRdID0gY29sbGVjdCB3aGVyZSB7Q2xpZW50TmFtZX0sIGF3YWl0IGNsaWVudExpc3QoSWQpXG4gICAgICBpZiBjbGllbnQgdGhlbiBjbGllbnQgZWxzZSBmYWxzZVxuXG4gIGNsaWVudEdldCA9ICh1c2VyUG9vbE5hbWUsIGNsaWVudE5hbWUpIC0+XG4gICAgY2xpZW50TmFtZSB8fD0gdXNlclBvb2xOYW1lXG4gICAge1VzZXJQb29sSWQsIENsaWVudElkfSA9IGF3YWl0IGNsaWVudEhlYWQgdXNlclBvb2xOYW1lLCBjbGllbnROYW1lXG4gICAgaWYgQ2xpZW50SWRcbiAgICAgIHtVc2VyUG9vbENsaWVudH0gPSBhd2FpdCBjb2cuZGVzY3JpYmVVc2VyUG9vbENsaWVudCB7VXNlclBvb2xJZCwgQ2xpZW50SWR9XG4gICAgICBVc2VyUG9vbENsaWVudFxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cblxuICB7cG9vbExpc3QsIHBvb2xIZWFkLCBwb29sR2V0LCBjbGllbnRMaXN0LCBjbGllbnRIZWFkLCBjbGllbnRHZXR9XG5cblxuZXhwb3J0IGRlZmF1bHQgY29nbml0b1ByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=primitives/cognito.coffee