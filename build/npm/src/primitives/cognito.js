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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL2NvZ25pdG8uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFMQTtBQUFBLElBQUEsZ0JBQUE7O0FBT0EsZ0JBQUEsR0FBbUIsVUFBQSxHQUFBLEVBQUE7QUFDakIsTUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUE7O0FBQUEsR0FBQSxVQUFBLGFBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQTtXQUFBLEdBQUEsR0FBTSw4QkFBQSxhQUFBLEVBQWtDLEdBQUcsQ0FBckMsOEJBQUEsQztBQURSLEdBQUE7O0FBR0EsRUFBQSxRQUFBLEdBQVcsZ0JBQUMsT0FBQSxHQUFELEVBQUEsRUFBQSxLQUFBLEVBQUE7QUFDVCxRQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQTtBQUFBLElBQUEsTUFBQSxHQUFTO0FBQUEsTUFBQSxVQUFBLEVBQVk7QUFBWixLQUFUOztBQUNBLFFBQUEsS0FBQSxFQUFBO0FBQUEsTUFBQSxNQUFNLENBQU4sU0FBQSxHQUFBLEtBQUE7OztBQUNBLEtBQUE7QUFBQSxNQUFBLFNBQUE7QUFBQSxNQUFBO0FBQUEsUUFBeUIsTUFBTSxHQUFHLENBQUgsYUFBQSxDQUEvQixNQUErQixDQUEvQjtBQUNBLElBQUEsT0FBQSxHQUFVLHlCQUFBLE9BQUEsRUFBQSxTQUFBLENBQVY7O0FBQ0EsUUFBQSxTQUFBLEVBQUE7QUFDRSxhQUFBLE1BQU0sUUFBQSxDQUFBLE9BQUEsRUFEUixTQUNRLENBQU47QUFERixLQUFBLE1BQUE7YUFBQSxPOztBQUxTLEdBQVg7O0FBVUEsRUFBQSxRQUFBLEdBQVcsZ0JBQUEsSUFBQSxFQUFBO0FBQ1QsUUFBQSxJQUFBO0FBQUEsS0FBQSxJQUFBLElBQVMseUJBQVEseUJBQU07QUFBQSxNQUFBLElBQUEsRUFBTTtB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c291cmNlc0NvbnRlbnQiOlsiIyBQcmltaXRpdmVzIGZvciB0aGUgc2VydmljZSBDb2duaXRvLiAgVGhlIGJhc2UgZW50aXR5IGlzIHRoZSBcInVzZXJcIi4gIE1ldGhvZHMgdGhhdCBhY3Qgb24gb3RoZXIgZW50aXRpZXMsIGxpa2UgcG9vbHMgb3IgY2xpZW50cyBhcmUgcHJlZml4ZWQgYXMgc3VjaC5cblxuaW1wb3J0IHtjYXR9IGZyb20gXCJwYW5kYS1wYXJjaG1lbnRcIlxuaW1wb3J0IHtjb2xsZWN0fSBmcm9tIFwicGFuZGEtcml2ZXJcIlxuaW1wb3J0IHt3aGVyZX0gZnJvbSBcIi4vcHJpdmF0ZS11dGlsc1wiXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5jb2duaXRvUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgY29nID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5Db2duaXRvSWRlbnRpdHlTZXJ2aWNlUHJvdmlkZXJcblxuICBwb29sTGlzdCA9IChjdXJyZW50PVtdLCB0b2tlbikgLT5cbiAgICBwYXJhbXMgPSBNYXhSZXN1bHRzOiA2MFxuICAgIHBhcmFtcy5OZXh0VG9rZW4gPSB0b2tlbiBpZiB0b2tlblxuICAgIHtVc2VyUG9vbHMsIE5leHRUb2tlbn0gPSBhd2FpdCBjb2cubGlzdFVzZXJQb29scyBwYXJhbXNcbiAgICBjdXJyZW50ID0gY2F0IGN1cnJlbnQsIFVzZXJQb29sc1xuICAgIGlmIE5leHRUb2tlblxuICAgICAgYXdhaXQgcG9vbExpc3QgY3VycmVudCwgTmV4dFRva2VuXG4gICAgZWxzZVxuICAgICAgY3VycmVudFxuXG4gIHBvb2xIZWFkID0gKG5hbWUpIC0+XG4gICAgW3Bvb2xdID0gY29sbGVjdCB3aGVyZSBOYW1lOiBuYW1lLCBhd2FpdCBwb29sTGlzdCgpXG4gICAgaWYgcG9vbCB0aGVuIHBvb2wgZWxzZSBmYWxzZVxuXG4gIHBvb2xHZXQgPSAobmFtZSkgLT5cbiAgICB7SWR9ID0gYXdhaXQgcG9vbEhlYWQgbmFtZVxuICAgIGlmICFJZFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgZWxzZVxuICAgICAge1VzZXJQb29sfSA9IGF3YWl0IGNvZy5kZXNjcmliZVVzZXJQb29sIFVzZXJQb29sSWQ6IElkXG4gICAgICBVc2VyUG9vbFxuXG4gIGNsaWVudExpc3QgPSAoVXNlclBvb2xJZCwgY3VycmVudD1bXSwgdG9rZW4pIC0+XG4gICAgcGFyYW1zID0ge1xuICAgICAgVXNlclBvb2xJZFxuICAgICAgTWF4UmVzdWx0czogNjBcbiAgICB9XG4gICAgcGFyYW1zLk5leHRUb2tlbiA9IHRva2VuIGlmIHRva2VuXG4gICAge1VzZXJQb29sQ2xpZW50cywgTmV4dFRva2VufSA9IGF3YWl0IGNvZy5saXN0VXNlclBvb2xDbGllbnRzIHBhcmFtc1xuICAgIGN1cnJlbnQgPSBjYXQgY3VycmVudCwgVXNlclBvb2xDbGllbnRzXG4gICAgaWYgTmV4dFRva2VuXG4gICAgICBhd2FpdCBjbGllbnRMaXN0IFVzZXJQb29sSWQsIGN1cnJlbnQsIE5leHRUb2tlblxuICAgIGVsc2VcbiAgICAgIGN1cnJlbnRcblxuICBjbGllbnRIZWFkID0gKFVzZXJQb29sT3ZlcmxvYWQsIENsaWVudE5hbWUpIC0+XG4gICAgaWYgQ2xpZW50TmFtZVxuICAgICAgSWQgPSBVc2VyUG9vbE92ZXJsb2FkXG4gICAgZWxzZVxuICAgICAgQ2xpZW50TmFtZSA9IFVzZXJQb29sTmFtZSA9IFVzZXJQb29sT3ZlcmxvYWRcbiAgICAgIHtJZH0gPSBhd2FpdCBwb29sSGVhZCBVc2VyUG9vbE5hbWVcblxuICAgIGlmICFJZFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgZWxzZVxuICAgICAgW2NsaWVudF0gPSBjb2xsZWN0IHdoZXJlIHtDbGllbnROYW1lfSwgYXdhaXQgY2xpZW50TGlzdChJZClcbiAgICAgIGlmIGNsaWVudCB0aGVuIGNsaWVudCBlbHNlIGZhbHNlXG5cbiAgY2xpZW50R2V0ID0gKHVzZXJQb29sTmFtZSwgY2xpZW50TmFtZSkgLT5cbiAgICBjbGllbnROYW1lIHx8PSB1c2VyUG9vbE5hbWVcbiAgICB7VXNlclBvb2xJZCwgQ2xpZW50SWR9ID0gYXdhaXQgY2xpZW50SGVhZCB1c2VyUG9vbE5hbWUsIGNsaWVudE5hbWVcbiAgICBpZiBDbGllbnRJZFxuICAgICAge1VzZXJQb29sQ2xpZW50fSA9IGF3YWl0IGNvZy5kZXNjcmliZVVzZXJQb29sQ2xpZW50IHtVc2VyUG9vbElkLCBDbGllbnRJZH1cbiAgICAgIFVzZXJQb29sQ2xpZW50XG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuXG4gIHtwb29sTGlzdCwgcG9vbEhlYWQsIHBvb2xHZXQsIGNsaWVudExpc3QsIGNsaWVudEhlYWQsIGNsaWVudEdldH1cblxuXG5leHBvcnQgZGVmYXVsdCBjb2duaXRvUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/cognito.coffee