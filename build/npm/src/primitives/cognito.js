"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pandaParchment = require("panda-parchment");

var _pandaRiver = require("panda-river");

var _utils = require("./utils");

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
    [pool] = (0, _pandaRiver.collect)((0, _utils.where)({
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
      [client] = (0, _pandaRiver.collect)((0, _utils.where)({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL2NvZ25pdG8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFMQTtBQUFBLElBQUEsZ0JBQUE7O0FBT0EsZ0JBQUEsR0FBbUIsVUFBQSxHQUFBLEVBQUE7QUFDakIsTUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUE7O0FBQUEsR0FBQSxVQUFBLGFBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQTtXQUFBLEdBQUEsR0FBTSw4QkFBQSxhQUFBLEVBQWtDLEdBQUcsQ0FBckMsOEJBQUEsQztBQURSLEdBQUE7O0FBR0EsRUFBQSxRQUFBLEdBQVcsZ0JBQUMsT0FBQSxHQUFELEVBQUEsRUFBQSxLQUFBLEVBQUE7QUFDVCxRQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTO0FBQUEsTUFBQSxVQUFBLEVBQVk7QUFBWixLQUFUOztBQUNBLFFBQUEsS0FBQSxFQUFBO0FBQUEsTUFBQSxNQUFNLENBQU4sU0FBQSxHQUFBLEtBQUE7OztBQUNBLEtBQUE7QUFBQSxNQUFBLFNBQUE7QUFBQSxNQUFBO0FBQUEsUUFBeUIsTUFBTSxHQUFHLENBQUgsYUFBQSxDQUEvQixNQUErQixDQUEvQjtBQUNBLElBQUEsT0FBQSxHQUFVLHlCQUFBLE9BQUEsRUFBQSxTQUFBLENBQVY7O0FBQ0EsUUFBQSxTQUFBLEVBQUE7QUFDRSxhQUFBLE1BQU0sUUFBQSxDQUFBLE9BQUEsRUFEUixTQUNRLENBQU47QUFERixLQUFBLE1BQUE7YUFBQSxPOztBQUxTLEdBQVg7O0FBVUEsRUFBQSxRQUFBLEdBQVcsZ0JBQUEsSUFBQSxFQUFBO0FBQ1QsUUFBQSxJQUFBO0FBQUEsS0FBQSxJQUFBLElBQVMseUJBQVEsa0JBQU07QUFBQSxNQUFBLElBQUEsRUFBTTtB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c291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBDb2duaXRvLiAgVGhlIGJhc2UgZW50aXR5IGlzIHRoZSBcInVzZXJcIi4gIE1ldGhvZHMgdGhhdCBhY3Qgb24gb3RoZXIgZW50aXRpZXMsIGxpa2UgcG9vbHMgb3IgY2xpZW50cyBhcmUgcHJlZml4ZWQgYXMgc3VjaC5cblxuaW1wb3J0IHtjYXR9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHtjb2xsZWN0fSBmcm9tIFwicGFuZGEtcml2ZXJcIlxuaW1wb3J0IHt3aGVyZX0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHthcHBseUNvbmZpZ3VyYXRpb259IGZyb20gXCIuLi9saWZ0XCJcblxuY29nbml0b1ByaW1pdGl2ZSA9IChTREspIC0+XG4gIChjb25maWd1cmF0aW9uKSAtPlxuICAgIGNvZyA9IGFwcGx5Q29uZmlndXJhdGlvbiBjb25maWd1cmF0aW9uLCBTREsuQ29nbml0b0lkZW50aXR5U2VydmljZVByb3ZpZGVyXG5cbiAgcG9vbExpc3QgPSAoY3VycmVudD1bXSwgdG9rZW4pIC0+XG4gICAgcGFyYW1zID0gTWF4UmVzdWx0czogNjBcbiAgICBwYXJhbXMuTmV4dFRva2VuID0gdG9rZW4gaWYgdG9rZW5cbiAgICB7VXNlclBvb2xzLCBOZXh0VG9rZW59ID0gYXdhaXQgY29nLmxpc3RVc2VyUG9vbHMgcGFyYW1zXG4gICAgY3VycmVudCA9IGNhdCBjdXJyZW50LCBVc2VyUG9vbHNcbiAgICBpZiBOZXh0VG9rZW5cbiAgICAgIGF3YWl0IHBvb2xMaXN0IGN1cnJlbnQsIE5leHRUb2tlblxuICAgIGVsc2VcbiAgICAgIGN1cnJlbnRcblxuICBwb29sSGVhZCA9IChuYW1lKSAtPlxuICAgIFtwb29sXSA9IGNvbGxlY3Qgd2hlcmUgTmFtZTogbmFtZSwgYXdhaXQgcG9vbExpc3QoKVxuICAgIGlmIHBvb2wgdGhlbiBwb29sIGVsc2UgZmFsc2VcblxuICBwb29sR2V0ID0gKG5hbWUpIC0+XG4gICAge0lkfSA9IGF3YWl0IHBvb2xIZWFkIG5hbWVcbiAgICBpZiAhSWRcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGVsc2VcbiAgICAgIHtVc2VyUG9vbH0gPSBhd2FpdCBjb2cuZGVzY3JpYmVVc2VyUG9vbCBVc2VyUG9vbElkOiBJZFxuICAgICAgVXNlclBvb2xcblxuICBjbGllbnRMaXN0ID0gKFVzZXJQb29sSWQsIGN1cnJlbnQ9W10sIHRva2VuKSAtPlxuICAgIHBhcmFtcyA9IHtcbiAgICAgIFVzZXJQb29sSWRcbiAgICAgIE1heFJlc3VsdHM6IDYwXG4gICAgfVxuICAgIHBhcmFtcy5OZXh0VG9rZW4gPSB0b2tlbiBpZiB0b2tlblxuICAgIHtVc2VyUG9vbENsaWVudHMsIE5leHRUb2tlbn0gPSBhd2FpdCBjb2cubGlzdFVzZXJQb29sQ2xpZW50cyBwYXJhbXNcbiAgICBjdXJyZW50ID0gY2F0IGN1cnJlbnQsIFVzZXJQb29sQ2xpZW50c1xuICAgIGlmIE5leHRUb2tlblxuICAgICAgYXdhaXQgY2xpZW50TGlzdCBVc2VyUG9vbElkLCBjdXJyZW50LCBOZXh0VG9rZW5cbiAgICBlbHNlXG4gICAgICBjdXJyZW50XG5cbiAgY2xpZW50SGVhZCA9IChVc2VyUG9vbE92ZXJsb2FkLCBDbGllbnROYW1lKSAtPlxuICAgIGlmIENsaWVudE5hbWVcbiAgICAgIElkID0gVXNlclBvb2xPdmVybG9hZFxuICAgIGVsc2VcbiAgICAgIENsaWVudE5hbWUgPSBVc2VyUG9vbE5hbWUgPSBVc2VyUG9vbE92ZXJsb2FkXG4gICAgICB7SWR9ID0gYXdhaXQgcG9vbEhlYWQgVXNlclBvb2xOYW1lXG5cbiAgICBpZiAhSWRcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIGVsc2VcbiAgICAgIFtjbGllbnRdID0gY29sbGVjdCB3aGVyZSB7Q2xpZW50TmFtZX0sIGF3YWl0IGNsaWVudExpc3QoSWQpXG4gICAgICBpZiBjbGllbnQgdGhlbiBjbGllbnQgZWxzZSBmYWxzZVxuXG4gIGNsaWVudEdldCA9ICh1c2VyUG9vbE5hbWUsIGNsaWVudE5hbWUpIC0+XG4gICAgY2xpZW50TmFtZSB8fD0gdXNlclBvb2xOYW1lXG4gICAge1VzZXJQb29sSWQsIENsaWVudElkfSA9IGF3YWl0IGNsaWVudEhlYWQgdXNlclBvb2xOYW1lLCBjbGllbnROYW1lXG4gICAgaWYgQ2xpZW50SWRcbiAgICAgIHtVc2VyUG9vbENsaWVudH0gPSBhd2FpdCBjb2cuZGVzY3JpYmVVc2VyUG9vbENsaWVudCB7VXNlclBvb2xJZCwgQ2xpZW50SWR9XG4gICAgICBVc2VyUG9vbENsaWVudFxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cblxuICB7cG9vbExpc3QsIHBvb2xIZWFkLCBwb29sR2V0LCBjbGllbnRMaXN0LCBjbGllbnRIZWFkLCBjbGllbnRHZXR9XG5cblxuZXhwb3J0IGRlZmF1bHQgY29nbml0b1ByaW1pdGl2ZVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/cognito.coffee