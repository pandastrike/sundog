"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _acm = _interopRequireDefault(require("./acm"));

var _asm = _interopRequireDefault(require("./asm"));

var _cloudformation = _interopRequireDefault(require("./cloudformation"));

var _cloudfront = _interopRequireDefault(require("./cloudfront"));

var _cloudwatchlogs = _interopRequireDefault(require("./cloudwatchlogs"));

var _cognito = _interopRequireDefault(require("./cognito"));

var _dynamodb = _interopRequireDefault(require("./dynamodb"));

var _ec = _interopRequireDefault(require("./ec2"));

var _kms = _interopRequireDefault(require("./kms"));

var _lambda = _interopRequireDefault(require("./lambda"));

var _neptune = _interopRequireDefault(require("./neptune"));

var _route = _interopRequireDefault(require("./route53"));

var _s = _interopRequireDefault(require("./s3"));

var _ses = _interopRequireDefault(require("./ses"));

var _sns = _interopRequireDefault(require("./sns"));

var _sts = _interopRequireDefault(require("./sts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Primitives;

Primitives = function (_AWS) {
  return Object.defineProperties({}, {
    ACM: {
      enumerable: true,
      get: function () {
        return (0, _acm.default)(_AWS.SDK);
      }
    },
    ASM: {
      enumerable: true,
      get: function () {
        return (0, _asm.default)(_AWS.SDK);
      }
    },
    CloudFormation: {
      enumerable: true,
      get: function () {
        return (0, _cloudformation.default)(_AWS.SDK);
      }
    },
    CloudFront: {
      enumerable: true,
      get: function () {
        return (0, _cloudfront.default)(_AWS.SDK);
      }
    },
    CloudWatchLogs: {
      enumerable: true,
      get: function () {
        return (0, _cloudwatchlogs.default)(_AWS.SDK);
      }
    },
    Cognito: {
      enumerable: true,
      get: function () {
        return (0, _cognito.default)(_AWS.SDK);
      }
    },
    DynamoDB: {
      enumerable: true,
      get: function () {
        return (0, _dynamodb.default)(_AWS.SDK);
      }
    },
    EC2: {
      enumerable: true,
      get: function () {
        return (0, _ec.default)(_AWS.SDK);
      }
    },
    KMS: {
      enumerable: true,
      get: function () {
        return (0, _kms.default)(_AWS.SDK);
      }
    },
    Lambda: {
      enumerable: true,
      get: function () {
        return (0, _lambda.default)(_AWS.SDK);
      }
    },
    Neptune: {
      enumerable: true,
      get: function () {
        return (0, _neptune.default)(_AWS.SDK);
      }
    },
    Route53: {
      enumerable: true,
      get: function () {
        return (0, _route.default)(_AWS.SDK);
      }
    },
    S3: {
      enumerable: true,
      get: function () {
        return (0, _s.default)(_AWS.SDK);
      }
    },
    SES: {
      enumerable: true,
      get: function () {
        return (0, _ses.default)(_AWS.SDK);
      }
    },
    SNS: {
      enumerable: true,
      get: function () {
        return (0, _sns.default)(_AWS.SDK);
      }
    },
    STS: {
      enumerable: true,
      get: function () {
        return (0, _sts.default)(_AWS.SDK);
      }
    }
  });
};

var _default = Primitives;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQWZBLElBQUEsVUFBQTs7QUFpQkEsVUFBQSxHQUFhLFVBQUEsSUFBQSxFQUFBO1NBQ1gsTUFBTSxDQUFOLGdCQUFBLENBQUEsRUFBQSxFQUNFO0FBQUEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBREY7QUFHQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0FKRjtBQU1BLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyw2QkFBZSxJQUFJLENBQW5CLEdBQUEsQztBQUFIO0FBREwsS0FQRjtBQVNBLElBQUEsVUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyx5QkFBVyxJQUFJLENBQWYsR0FBQSxDO0FBQUg7QUFETCxLQVZGO0FBWUEsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLDZCQUFlLElBQUksQ0FBbkIsR0FBQSxDO0FBQUg7QUFETCxLQWJGO0FBZUEsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHNCQUFRLElBQUksQ0FBWixHQUFBLEM7QUFBSDtBQURMLEtBaEJGO0FBa0JBLElBQUEsUUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyx1QkFBUyxJQUFJLENBQWIsR0FBQSxDO0FBQUg7QUFETCxLQW5CRjtBQXFCQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsaUJBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0F0QkY7QUF3QkEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBekJGO0FBMkJBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxxQkFBTyxJQUFJLENBQVgsR0FBQSxDO0FBQUg7QUFETCxLQTVCRjtBQThCQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQVEsSUFBSSxDQUFaLEdBQUEsQztBQUFIO0FBREwsS0EvQkY7QUFpQ0EsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLG9CQUFRLElBQUksQ0FBWixHQUFBLEM7QUFBSDtBQURMLEtBbENGO0FBb0NBLElBQUEsRUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxnQkFBRyxJQUFJLENBQVAsR0FBQSxDO0FBQUg7QUFETCxLQXJDRjtBQXVDQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0F4Q0Y7QUEwQ0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBM0NGO0FBNkNBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETDtBQTlDRixHQURGLEM7QUFEVyxDQUFiOztlQW1EZSxVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFjbSBmcm9tIFwiLi9hY21cIlxuaW1wb3J0IGFzbSBmcm9tIFwiLi9hc21cIlxuaW1wb3J0IGNsb3VkZm9ybWF0aW9uIGZyb20gXCIuL2Nsb3VkZm9ybWF0aW9uXCJcbmltcG9ydCBjbG91ZGZyb250IGZyb20gXCIuL2Nsb3VkZnJvbnRcIlxuaW1wb3J0IGNsb3Vkd2F0Y2hsb2dzIGZyb20gXCIuL2Nsb3Vkd2F0Y2hsb2dzXCJcbmltcG9ydCBjb2duaXRvIGZyb20gXCIuL2NvZ25pdG9cIlxuaW1wb3J0IGR5bmFtb2RiIGZyb20gXCIuL2R5bmFtb2RiXCJcbmltcG9ydCBlYzIgZnJvbSBcIi4vZWMyXCJcbmltcG9ydCBrbXMgZnJvbSBcIi4va21zXCJcbmltcG9ydCBsYW1iZGEgZnJvbSBcIi4vbGFtYmRhXCJcbmltcG9ydCBuZXB0dW5lIGZyb20gXCIuL25lcHR1bmVcIlxuaW1wb3J0IHJvdXRlNTMgZnJvbSBcIi4vcm91dGU1M1wiXG5pbXBvcnQgczMgZnJvbSBcIi4vczNcIlxuaW1wb3J0IHNlcyBmcm9tIFwiLi9zZXNcIlxuaW1wb3J0IHNucyBmcm9tIFwiLi9zbnNcIlxuaW1wb3J0IHN0cyBmcm9tIFwiLi9zdHNcIlxuXG5QcmltaXRpdmVzID0gKF9BV1MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIHt9LFxuICAgIEFDTTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gYWNtIF9BV1MuU0RLXG4gICAgQVNNOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBhc20gX0FXUy5TREtcbiAgICBDbG91ZEZvcm1hdGlvbjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY2xvdWRmb3JtYXRpb24gX0FXUy5TREtcbiAgICBDbG91ZEZyb250OlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjbG91ZGZyb250IF9BV1MuU0RLXG4gICAgQ2xvdWRXYXRjaExvZ3M6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNsb3Vkd2F0Y2hsb2dzIF9BV1MuU0RLXG4gICAgQ29nbml0bzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY29nbml0byBfQVdTLlNES1xuICAgIER5bmFtb0RCOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBkeW5hbW9kYiBfQVdTLlNES1xuICAgIEVDMjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gZWMyIF9BV1MuU0RLXG4gICAgS01TOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBrbXMgX0FXUy5TREtcbiAgICBMYW1iZGE6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGxhbWJkYSBfQVdTLlNES1xuICAgIE5lcHR1bmU6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IG5lcHR1bmUgX0FXUy5TREtcbiAgICBSb3V0ZTUzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiByb3V0ZTUzIF9BV1MuU0RLXG4gICAgUzM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHMzIF9BV1MuU0RLXG4gICAgU0VTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzZXMgX0FXUy5TREtcbiAgICBTTlM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHNucyBfQVdTLlNES1xuICAgIFNUUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc3RzIF9BV1MuU0RLXG5cbmV4cG9ydCBkZWZhdWx0IFByaW1pdGl2ZXNcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=/Users/david/repos/sundog/src/primitives/index.coffee