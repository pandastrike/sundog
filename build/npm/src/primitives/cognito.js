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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvY29nbml0by5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUxBO0FBQUEsSUFBQSxnQkFBQTs7QUFPQSxnQkFBQSxHQUFtQixVQUFBLEdBQUEsRUFBQTtBQUNqQixNQUFBLFNBQUEsRUFBQSxVQUFBLEVBQUEsVUFBQSxFQUFBLE9BQUEsRUFBQSxRQUFBLEVBQUEsUUFBQTs7QUFBQSxHQUFBLFVBQUEsYUFBQSxFQUFBO0FBQ0UsUUFBQSxHQUFBO1dBQUEsR0FBQSxHQUFNLDhCQUFBLGFBQUEsRUFBa0MsR0FBRyxDQUFyQyw4QkFBQSxDO0FBRFIsR0FBQTs7QUFHQSxFQUFBLFFBQUEsR0FBVyxnQkFBQyxPQUFBLEdBQUQsRUFBQSxFQUFBLEtBQUEsRUFBQTtBQUNULFFBQUEsU0FBQSxFQUFBLFNBQUEsRUFBQSxNQUFBO0FBQUEsSUFBQSxNQUFBLEdBQVM7QUFBQSxNQUFBLFVBQUEsRUFBWTtBQUFaLEtBQVQ7O0FBQ0EsUUFBQSxLQUFBLEVBQUE7QUFBQSxNQUFBLE1BQU0sQ0FBTixTQUFBLEdBQUEsS0FBQTs7O0FBQ0EsS0FBQTtBQUFBLE1BQUEsU0FBQTtBQUFBLE1BQUE7QUFBQSxRQUF5QixNQUFNLEdBQUcsQ0FBSCxhQUFBLENBQS9CLE1BQStCLENBQS9CO0FBQ0EsSUFBQSxPQUFBLEdBQVUseUJBQUEsT0FBQSxFQUFBLFNBQUEsQ0FBVjs7QUFDQSxRQUFBLFNBQUEsRUFBQTtBQUNFLGFBQUEsTUFBTSxRQUFBLENBQUEsT0FBQSxFQURSLFNBQ1EsQ0FBTjtBQURGLEtBQUEsTUFBQTthQUFBLE87O0FBTFMsR0FBWDs7QUFVQSxFQUFBLFFBQUEsR0FBVyxnQkFBQSxJQUFBLEVBQUE7QUFDVCxRQUFBLElBQUE7QUFBQSxLQUFBLElBQUEsSUFBUyx5QkFBUSxrQkFBTTtBQUFBLE1BQUEsSUFBQSxFQUFNO0FBQU4sS0FBTixHQUFrQixNQUFNLFFBQWhDLEVBQVEsRUFBUixD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ZSBzZXJ2aWNlIENvZ25pdG8uICBUaGUgYmFzZSBlbnRpdHkgaXMgdGhlIFwidXNlclwiLiAgTWV0aG9kcyB0aGF0IGFjdCBvbiBvdGhlciBlbnRpdGllcywgbGlrZSBwb29scyBvciBjbGllbnRzIGFyZSBwcmVmaXhlZCBhcyBzdWNoLlxuXG5pbXBvcnQge2NhdH0gZnJvbSBcInBhbmRhLXBhcmNobWVudFwiXG5pbXBvcnQge2NvbGxlY3R9IGZyb20gXCJwYW5kYS1yaXZlclwiXG5pbXBvcnQge3doZXJlfSBmcm9tIFwiLi91dGlsc1wiXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5jb2duaXRvUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgY29nID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5Db2duaXRvSWRlbnRpdHlTZXJ2aWNlUHJvdmlkZXJcblxuICBwb29sTGlzdCA9IChjdXJyZW50PVtdLCB0b2tlbikgLT5cbiAgICBwYXJhbXMgPSBNYXhSZXN1bHRzOiA2MFxuICAgIHBhcmFtcy5OZXh0VG9rZW4gPSB0b2tlbiBpZiB0b2tlblxuICAgIHtVc2VyUG9vbHMsIE5leHRUb2tlbn0gPSBhd2FpdCBjb2cubGlzdFVzZXJQb29scyBwYXJhbXNcbiAgICBjdXJyZW50ID0gY2F0IGN1cnJlbnQsIFVzZXJQb29sc1xuICAgIGlmIE5leHRUb2tlblxuICAgICAgYXdhaXQgcG9vbExpc3QgY3VycmVudCwgTmV4dFRva2VuXG4gICAgZWxzZVxuICAgICAgY3VycmVudFxuXG4gIHBvb2xIZWFkID0gKG5hbWUpIC0+XG4gICAgW3Bvb2xdID0gY29sbGVjdCB3aGVyZSBOYW1lOiBuYW1lLCBhd2FpdCBwb29sTGlzdCgpXG4gICAgaWYgcG9vbCB0aGVuIHBvb2wgZWxzZSBmYWxzZVxuXG4gIHBvb2xHZXQgPSAobmFtZSkgLT5cbiAgICB7SWR9ID0gYXdhaXQgcG9vbEhlYWQgbmFtZVxuICAgIGlmICFJZFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgZWxzZVxuICAgICAge1VzZXJQb29sfSA9IGF3YWl0IGNvZy5kZXNjcmliZVVzZXJQb29sIFVzZXJQb29sSWQ6IElkXG4gICAgICBVc2VyUG9vbFxuXG4gIGNsaWVudExpc3QgPSAoVXNlclBvb2xJZCwgY3VycmVudD1bXSwgdG9rZW4pIC0+XG4gICAgcGFyYW1zID0ge1xuICAgICAgVXNlclBvb2xJZFxuICAgICAgTWF4UmVzdWx0czogNjBcbiAgICB9XG4gICAgcGFyYW1zLk5leHRUb2tlbiA9IHRva2VuIGlmIHRva2VuXG4gICAge1VzZXJQb29sQ2xpZW50cywgTmV4dFRva2VufSA9IGF3YWl0IGNvZy5saXN0VXNlclBvb2xDbGllbnRzIHBhcmFtc1xuICAgIGN1cnJlbnQgPSBjYXQgY3VycmVudCwgVXNlclBvb2xDbGllbnRzXG4gICAgaWYgTmV4dFRva2VuXG4gICAgICBhd2FpdCBjbGllbnRMaXN0IFVzZXJQb29sSWQsIGN1cnJlbnQsIE5leHRUb2tlblxuICAgIGVsc2VcbiAgICAgIGN1cnJlbnRcblxuICBjbGllbnRIZWFkID0gKFVzZXJQb29sT3ZlcmxvYWQsIENsaWVudE5hbWUpIC0+XG4gICAgaWYgQ2xpZW50TmFtZVxuICAgICAgSWQgPSBVc2VyUG9vbE92ZXJsb2FkXG4gICAgZWxzZVxuICAgICAgQ2xpZW50TmFtZSA9IFVzZXJQb29sTmFtZSA9IFVzZXJQb29sT3ZlcmxvYWRcbiAgICAgIHtJZH0gPSBhd2FpdCBwb29sSGVhZCBVc2VyUG9vbE5hbWVcblxuICAgIGlmICFJZFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgZWxzZVxuICAgICAgW2NsaWVudF0gPSBjb2xsZWN0IHdoZXJlIHtDbGllbnROYW1lfSwgYXdhaXQgY2xpZW50TGlzdChJZClcbiAgICAgIGlmIGNsaWVudCB0aGVuIGNsaWVudCBlbHNlIGZhbHNlXG5cbiAgY2xpZW50R2V0ID0gKHVzZXJQb29sTmFtZSwgY2xpZW50TmFtZSkgLT5cbiAgICBjbGllbnROYW1lIHx8PSB1c2VyUG9vbE5hbWVcbiAgICB7VXNlclBvb2xJZCwgQ2xpZW50SWR9ID0gYXdhaXQgY2xpZW50SGVhZCB1c2VyUG9vbE5hbWUsIGNsaWVudE5hbWVcbiAgICBpZiBDbGllbnRJZFxuICAgICAge1VzZXJQb29sQ2xpZW50fSA9IGF3YWl0IGNvZy5kZXNjcmliZVVzZXJQb29sQ2xpZW50IHtVc2VyUG9vbElkLCBDbGllbnRJZH1cbiAgICAgIFVzZXJQb29sQ2xpZW50XG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuXG4gIHtwb29sTGlzdCwgcG9vbEhlYWQsIHBvb2xHZXQsIGNsaWVudExpc3QsIGNsaWVudEhlYWQsIGNsaWVudEdldH1cblxuXG5leHBvcnQgZGVmYXVsdCBjb2duaXRvUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=primitives/cognito.coffee