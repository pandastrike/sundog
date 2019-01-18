"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _acm = _interopRequireDefault(require("./acm"));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFkQSxJQUFBLFVBQUE7O0FBZ0JBLFVBQUEsR0FBYSxVQUFBLElBQUEsRUFBQTtTQUNYLE1BQU0sQ0FBTixnQkFBQSxDQUFBLEVBQUEsRUFDRTtBQUFBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQURGO0FBR0EsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLDZCQUFlLElBQUksQ0FBbkIsR0FBQSxDO0FBQUg7QUFETCxLQUpGO0FBTUEsSUFBQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHlCQUFXLElBQUksQ0FBZixHQUFBLEM7QUFBSDtBQURMLEtBUEY7QUFTQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsNkJBQWUsSUFBSSxDQUFuQixHQUFBLEM7QUFBSDtBQURMLEtBVkY7QUFZQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQVEsSUFBSSxDQUFaLEdBQUEsQztBQUFIO0FBREwsS0FiRjtBQWVBLElBQUEsUUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyx1QkFBUyxJQUFJLENBQWIsR0FBQSxDO0FBQUg7QUFETCxLQWhCRjtBQWtCQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsaUJBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0FuQkY7QUFxQkEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBdEJGO0FBd0JBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxxQkFBTyxJQUFJLENBQVgsR0FBQSxDO0FBQUg7QUFETCxLQXpCRjtBQTJCQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQVEsSUFBSSxDQUFaLEdBQUEsQztBQUFIO0FBREwsS0E1QkY7QUE4QkEsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLG9CQUFRLElBQUksQ0FBWixHQUFBLEM7QUFBSDtBQURMLEtBL0JGO0FBaUNBLElBQUEsRUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxnQkFBRyxJQUFJLENBQVAsR0FBQSxDO0FBQUg7QUFETCxLQWxDRjtBQW9DQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0FyQ0Y7QUF1Q0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBeENGO0FBMENBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETDtBQTNDRixHQURGLEM7QUFEVyxDQUFiOztlQWdEZSxVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFjbSBmcm9tIFwiLi9hY21cIlxuaW1wb3J0IGNsb3VkZm9ybWF0aW9uIGZyb20gXCIuL2Nsb3VkZm9ybWF0aW9uXCJcbmltcG9ydCBjbG91ZGZyb250IGZyb20gXCIuL2Nsb3VkZnJvbnRcIlxuaW1wb3J0IGNsb3Vkd2F0Y2hsb2dzIGZyb20gXCIuL2Nsb3Vkd2F0Y2hsb2dzXCJcbmltcG9ydCBjb2duaXRvIGZyb20gXCIuL2NvZ25pdG9cIlxuaW1wb3J0IGR5bmFtb2RiIGZyb20gXCIuL2R5bmFtb2RiXCJcbmltcG9ydCBlYzIgZnJvbSBcIi4vZWMyXCJcbmltcG9ydCBrbXMgZnJvbSBcIi4va21zXCJcbmltcG9ydCBsYW1iZGEgZnJvbSBcIi4vbGFtYmRhXCJcbmltcG9ydCBuZXB0dW5lIGZyb20gXCIuL25lcHR1bmVcIlxuaW1wb3J0IHJvdXRlNTMgZnJvbSBcIi4vcm91dGU1M1wiXG5pbXBvcnQgczMgZnJvbSBcIi4vczNcIlxuaW1wb3J0IHNlcyBmcm9tIFwiLi9zZXNcIlxuaW1wb3J0IHNucyBmcm9tIFwiLi9zbnNcIlxuaW1wb3J0IHN0cyBmcm9tIFwiLi9zdHNcIlxuXG5QcmltaXRpdmVzID0gKF9BV1MpIC0+XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIHt9LFxuICAgIEFDTTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gYWNtIF9BV1MuU0RLXG4gICAgQ2xvdWRGb3JtYXRpb246XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNsb3VkZm9ybWF0aW9uIF9BV1MuU0RLXG4gICAgQ2xvdWRGcm9udDpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY2xvdWRmcm9udCBfQVdTLlNES1xuICAgIENsb3VkV2F0Y2hMb2dzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjbG91ZHdhdGNobG9ncyBfQVdTLlNES1xuICAgIENvZ25pdG86XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNvZ25pdG8gX0FXUy5TREtcbiAgICBEeW5hbW9EQjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gZHluYW1vZGIgX0FXUy5TREtcbiAgICBFQzI6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGVjMiBfQVdTLlNES1xuICAgIEtNUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4ga21zIF9BV1MuU0RLXG4gICAgTGFtYmRhOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBsYW1iZGEgX0FXUy5TREtcbiAgICBOZXB0dW5lOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBuZXB0dW5lIF9BV1MuU0RLXG4gICAgUm91dGU1MzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gcm91dGU1MyBfQVdTLlNES1xuICAgIFMzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzMyBfQVdTLlNES1xuICAgIFNFUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc2VzIF9BV1MuU0RLXG4gICAgU05TOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzbnMgX0FXUy5TREtcbiAgICBTVFM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHN0cyBfQVdTLlNES1xuXG5leHBvcnQgZGVmYXVsdCBQcmltaXRpdmVzXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/index.coffee