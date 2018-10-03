"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fairmont = require("fairmont");

var _lift = require("../lift");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.
var cognitoPrimitive;

cognitoPrimitive = function (SDK) {
  var clientGet, clientHead, clientList, poolGet, poolHead, poolList;

  (function (configuration) {
    var cog;
    return cog = (0, _lift.applyConfiguration)(configuration, SDK.CognitoIdentityServiceProvider);
  });

  poolList =
  /*#__PURE__*/
  function () {
    var _ref = _asyncToGenerator(function* (current = [], token) {
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
      } = yield cog.listUserPools(params));
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
  }();

  poolHead =
  /*#__PURE__*/
  function () {
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
  }();

  poolGet =
  /*#__PURE__*/
  function () {
    var _ref3 = _asyncToGenerator(function* (name) {
      var Id, UserPool;
      ({
        Id
      } = yield poolHead(name));

      if (!Id) {
        return false;
      } else {
        ({
          UserPool
        } = yield cog.describeUserPool({
          UserPoolId: Id
        }));
        return UserPool;
      }
    });

    return function poolGet(_x2) {
      return _ref3.apply(this, arguments);
    };
  }();

  clientList =
  /*#__PURE__*/
  function () {
    var _ref4 = _asyncToGenerator(function* (UserPoolId, current = [], token) {
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
      } = yield cog.listUserPoolClients(params));
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
  }();

  clientHead =
  /*#__PURE__*/
  function () {
    var _ref5 = _asyncToGenerator(function* (UserPoolOverload, ClientName) {
      var Id, UserPoolName, client;

      if (ClientName) {
        Id = UserPoolOverload;
      } else {
        ClientName = UserPoolName = UserPoolOverload;
        ({
          Id
        } = yield poolHead(UserPoolName));
      }

      if (!Id) {
        return false;
      } else {
        [client] = (0, _fairmont.collect)((0, _fairmont.where)({
          ClientName
        }, (yield clientList(Id))));

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
  }();

  clientGet =
  /*#__PURE__*/
  function () {
    var _ref6 = _asyncToGenerator(function* (userPoolName, clientName) {
      var ClientId, UserPoolClient, UserPoolId;
      clientName || (clientName = userPoolName);
      ({
        UserPoolId,
        ClientId
      } = yield clientHead(userPoolName, clientName));

      if (ClientId) {
        ({
          UserPoolClient
        } = yield cog.describeUserPoolClient({
          UserPoolId,
          ClientId
        }));
        return UserPoolClient;
      } else {
        return false;
      }
    });

    return function clientGet(_x6, _x7) {
      return _ref6.apply(this, arguments);
    };
  }();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvY29nbml0by5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOzs7Ozs7QUFIQTtBQUFBLElBQUEsZ0JBQUE7O0FBS0EsZ0JBQUEsR0FBbUIsVUFBQSxHQUFBLEVBQUE7QUFDakIsTUFBQSxTQUFBLEVBQUEsVUFBQSxFQUFBLFVBQUEsRUFBQSxPQUFBLEVBQUEsUUFBQSxFQUFBLFFBQUE7O0FBQUEsR0FBQSxVQUFBLGFBQUEsRUFBQTtBQUNFLFFBQUEsR0FBQTtXQUFBLEdBQUEsR0FBTSw4QkFBQSxhQUFBLEVBQWtDLEdBQUcsQ0FBckMsOEJBQUEsQztBQURSLEdBQUE7O0FBR0EsRUFBQSxRQUFBO0FBQUE7QUFBQTtBQUFBLGlDQUFXLFdBQUMsT0FBQSxHQUFELEVBQUEsRUFBQSxLQUFBLEVBQUE7QUFDVCxVQUFBLFNBQUEsRUFBQSxTQUFBLEVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFTO0FBQUEsUUFBQSxVQUFBLEVBQVk7QUFBWixPQUFUOztBQUNBLFVBQUEsS0FBQSxFQUFBO0FBQUEsUUFBQSxNQUFNLENBQU4sU0FBQSxHQUFBLEtBQUE7OztBQUNBLE9BQUE7QUFBQSxRQUFBLFNBQUE7QUFBQSxRQUFBO0FBQUEsZ0JBQStCLEdBQUcsQ0FBSCxhQUFBLENBQS9CLE1BQStCLENBQS9CO0FBQ0EsTUFBQSxPQUFBLEdBQVUsbUJBQUEsT0FBQSxFQUFBLFNBQUEsQ0FBVjs7QUFDQSxVQUFBLFNBQUEsRUFBQTtBQUNFLHFCQUFNLFFBQUEsQ0FBQSxPQUFBLEVBRFIsU0FDUSxDQUFOO0FBREYsT0FBQSxNQUFBO2VBQUEsTzs7QUFMUyxLQUFYOztBQUFBO0FBQUE7QUFBQTtBQUFBLEtBQUE7O0FBVUEsRUFBQSxRQUFBO0FBQUE7QUFBQTtBQUFBLGtDQUFXLFdBQUEsSUFBQSxFQUFBO0FBQ1QsVUFBQSxJQUFBO0FBQUEsT0FBQSxJQUFBLElBQVMsdUJBQVEscUJBQU07QUFBQSxRQUFBLElBQUEsRUFB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QUhVLEtBQVo7O0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FBQTs7U0FVQTtBQUFBLElBQUEsUUFBQTtBQUFBLElBQUEsUUFBQTtBQUFBLElBQUEsT0FBQTtBQUFBLElBQUEsVUFBQTtBQUFBLElBQUEsVUFBQTtBQUFBLElBQUE7QUFBQSxHO0FBOURpQixDQUFuQjs7ZUFpRWUsZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIjIFByaW1pdGl2ZXMgZm9yIHRoZSBzZXJ2aWNlIENvZ25pdG8uICBUaGUgYmFzZSBlbnRpdHkgaXMgdGhlIFwidXNlclwiLiAgTWV0aG9kcyB0aGF0IGFjdCBvbiBvdGhlciBlbnRpdGllcywgbGlrZSBwb29scyBvciBjbGllbnRzIGFyZSBwcmVmaXhlZCBhcyBzdWNoLlxuXG5pbXBvcnQge2NhdCwgY29sbGVjdCwgd2hlcmV9IGZyb20gXCJmYWlybW9udFwiXG5pbXBvcnQge2FwcGx5Q29uZmlndXJhdGlvbn0gZnJvbSBcIi4uL2xpZnRcIlxuXG5jb2duaXRvUHJpbWl0aXZlID0gKFNESykgLT5cbiAgKGNvbmZpZ3VyYXRpb24pIC0+XG4gICAgY29nID0gYXBwbHlDb25maWd1cmF0aW9uIGNvbmZpZ3VyYXRpb24sIFNESy5Db2duaXRvSWRlbnRpdHlTZXJ2aWNlUHJvdmlkZXJcblxuICBwb29sTGlzdCA9IChjdXJyZW50PVtdLCB0b2tlbikgLT5cbiAgICBwYXJhbXMgPSBNYXhSZXN1bHRzOiA2MFxuICAgIHBhcmFtcy5OZXh0VG9rZW4gPSB0b2tlbiBpZiB0b2tlblxuICAgIHtVc2VyUG9vbHMsIE5leHRUb2tlbn0gPSBhd2FpdCBjb2cubGlzdFVzZXJQb29scyBwYXJhbXNcbiAgICBjdXJyZW50ID0gY2F0IGN1cnJlbnQsIFVzZXJQb29sc1xuICAgIGlmIE5leHRUb2tlblxuICAgICAgYXdhaXQgcG9vbExpc3QgY3VycmVudCwgTmV4dFRva2VuXG4gICAgZWxzZVxuICAgICAgY3VycmVudFxuXG4gIHBvb2xIZWFkID0gKG5hbWUpIC0+XG4gICAgW3Bvb2xdID0gY29sbGVjdCB3aGVyZSBOYW1lOiBuYW1lLCBhd2FpdCBwb29sTGlzdCgpXG4gICAgaWYgcG9vbCB0aGVuIHBvb2wgZWxzZSBmYWxzZVxuXG4gIHBvb2xHZXQgPSAobmFtZSkgLT5cbiAgICB7SWR9ID0gYXdhaXQgcG9vbEhlYWQgbmFtZVxuICAgIGlmICFJZFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgZWxzZVxuICAgICAge1VzZXJQb29sfSA9IGF3YWl0IGNvZy5kZXNjcmliZVVzZXJQb29sIFVzZXJQb29sSWQ6IElkXG4gICAgICBVc2VyUG9vbFxuXG4gIGNsaWVudExpc3QgPSAoVXNlclBvb2xJZCwgY3VycmVudD1bXSwgdG9rZW4pIC0+XG4gICAgcGFyYW1zID0ge1xuICAgICAgVXNlclBvb2xJZFxuICAgICAgTWF4UmVzdWx0czogNjBcbiAgICB9XG4gICAgcGFyYW1zLk5leHRUb2tlbiA9IHRva2VuIGlmIHRva2VuXG4gICAge1VzZXJQb29sQ2xpZW50cywgTmV4dFRva2VufSA9IGF3YWl0IGNvZy5saXN0VXNlclBvb2xDbGllbnRzIHBhcmFtc1xuICAgIGN1cnJlbnQgPSBjYXQgY3VycmVudCwgVXNlclBvb2xDbGllbnRzXG4gICAgaWYgTmV4dFRva2VuXG4gICAgICBhd2FpdCBjbGllbnRMaXN0IFVzZXJQb29sSWQsIGN1cnJlbnQsIE5leHRUb2tlblxuICAgIGVsc2VcbiAgICAgIGN1cnJlbnRcblxuICBjbGllbnRIZWFkID0gKFVzZXJQb29sT3ZlcmxvYWQsIENsaWVudE5hbWUpIC0+XG4gICAgaWYgQ2xpZW50TmFtZVxuICAgICAgSWQgPSBVc2VyUG9vbE92ZXJsb2FkXG4gICAgZWxzZVxuICAgICAgQ2xpZW50TmFtZSA9IFVzZXJQb29sTmFtZSA9IFVzZXJQb29sT3ZlcmxvYWRcbiAgICAgIHtJZH0gPSBhd2FpdCBwb29sSGVhZCBVc2VyUG9vbE5hbWVcblxuICAgIGlmICFJZFxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgZWxzZVxuICAgICAgW2NsaWVudF0gPSBjb2xsZWN0IHdoZXJlIHtDbGllbnROYW1lfSwgYXdhaXQgY2xpZW50TGlzdChJZClcbiAgICAgIGlmIGNsaWVudCB0aGVuIGNsaWVudCBlbHNlIGZhbHNlXG5cbiAgY2xpZW50R2V0ID0gKHVzZXJQb29sTmFtZSwgY2xpZW50TmFtZSkgLT5cbiAgICBjbGllbnROYW1lIHx8PSB1c2VyUG9vbE5hbWVcbiAgICB7VXNlclBvb2xJZCwgQ2xpZW50SWR9ID0gYXdhaXQgY2xpZW50SGVhZCB1c2VyUG9vbE5hbWUsIGNsaWVudE5hbWVcbiAgICBpZiBDbGllbnRJZFxuICAgICAge1VzZXJQb29sQ2xpZW50fSA9IGF3YWl0IGNvZy5kZXNjcmliZVVzZXJQb29sQ2xpZW50IHtVc2VyUG9vbElkLCBDbGllbnRJZH1cbiAgICAgIFVzZXJQb29sQ2xpZW50XG4gICAgZWxzZVxuICAgICAgZmFsc2VcblxuXG4gIHtwb29sTGlzdCwgcG9vbEhlYWQsIHBvb2xHZXQsIGNsaWVudExpc3QsIGNsaWVudEhlYWQsIGNsaWVudEdldH1cblxuXG5leHBvcnQgZGVmYXVsdCBjb2duaXRvUHJpbWl0aXZlXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=primitives/cognito.coffee