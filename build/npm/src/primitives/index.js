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

var _sqs = _interopRequireDefault(require("./sqs"));

var _step = _interopRequireDefault(require("./step"));

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
    SQS: {
      enumerable: true,
      get: function () {
        return (0, _sqs.default)(_AWS.SDK);
      }
    },
    StepFunctions: {
      enumerable: true,
      get: function () {
        return (0, _step.default)(_AWS.SDK);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQWpCQSxJQUFBLFVBQUE7O0FBbUJBLFVBQUEsR0FBYSxVQUFBLElBQUEsRUFBQTtTQUNYLE1BQU0sQ0FBTixnQkFBQSxDQUFBLEVBQUEsRUFDRTtBQUFBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQURGO0FBR0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBSkY7QUFNQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsNkJBQWUsSUFBSSxDQUFuQixHQUFBLEM7QUFBSDtBQURMLEtBUEY7QUFTQSxJQUFBLFVBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcseUJBQVcsSUFBSSxDQUFmLEdBQUEsQztBQUFIO0FBREwsS0FWRjtBQVlBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyw2QkFBZSxJQUFJLENBQW5CLEdBQUEsQztBQUFIO0FBREwsS0FiRjtBQWVBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxzQkFBUSxJQUFJLENBQVosR0FBQSxDO0FBQUg7QUFETCxLQWhCRjtBQWtCQSxJQUFBLFFBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsdUJBQVMsSUFBSSxDQUFiLEdBQUEsQztBQUFIO0FBREwsS0FuQkY7QUFxQkEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGlCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBdEJGO0FBd0JBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQXpCRjtBQTJCQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcscUJBQU8sSUFBSSxDQUFYLEdBQUEsQztBQUFIO0FBREwsS0E1QkY7QUE4QkEsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHNCQUFRLElBQUksQ0FBWixHQUFBLEM7QUFBSDtBQURMLEtBL0JGO0FBaUNBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxvQkFBUSxJQUFJLENBQVosR0FBQSxDO0FBQUg7QUFETCxLQWxDRjtBQW9DQSxJQUFBLEVBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsZ0JBQUcsSUFBSSxDQUFQLEdBQUEsQztBQUFIO0FBREwsS0FyQ0Y7QUF1Q0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBeENGO0FBMENBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQTNDRjtBQTZDQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0E5Q0Y7QUFnREEsSUFBQSxhQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLG1CQUFLLElBQUksQ0FBVCxHQUFBLEM7QUFBSDtBQURMLEtBakRGO0FBbURBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETDtBQXBERixHQURGLEM7QUFEVyxDQUFiOztlQXlEZSxVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFjbSBmcm9tIFwiLi9hY21cIlxuaW1wb3J0IGFzbSBmcm9tIFwiLi9hc21cIlxuaW1wb3J0IGNsb3VkZm9ybWF0aW9uIGZyb20gXCIuL2Nsb3VkZm9ybWF0aW9uXCJcbmltcG9ydCBjbG91ZGZyb250IGZyb20gXCIuL2Nsb3VkZnJvbnRcIlxuaW1wb3J0IGNsb3Vkd2F0Y2hsb2dzIGZyb20gXCIuL2Nsb3Vkd2F0Y2hsb2dzXCJcbmltcG9ydCBjb2duaXRvIGZyb20gXCIuL2NvZ25pdG9cIlxuaW1wb3J0IGR5bmFtb2RiIGZyb20gXCIuL2R5bmFtb2RiXCJcbmltcG9ydCBlYzIgZnJvbSBcIi4vZWMyXCJcbmltcG9ydCBrbXMgZnJvbSBcIi4va21zXCJcbmltcG9ydCBsYW1iZGEgZnJvbSBcIi4vbGFtYmRhXCJcbmltcG9ydCBuZXB0dW5lIGZyb20gXCIuL25lcHR1bmVcIlxuaW1wb3J0IHJvdXRlNTMgZnJvbSBcIi4vcm91dGU1M1wiXG5pbXBvcnQgczMgZnJvbSBcIi4vczNcIlxuaW1wb3J0IHNlcyBmcm9tIFwiLi9zZXNcIlxuaW1wb3J0IHNucyBmcm9tIFwiLi9zbnNcIlxuaW1wb3J0IHNxcyBmcm9tIFwiLi9zcXNcIlxuaW1wb3J0IHN0ZXAgZnJvbSBcIi4vc3RlcFwiXG5pbXBvcnQgc3RzIGZyb20gXCIuL3N0c1wiXG5cblByaW1pdGl2ZXMgPSAoX0FXUykgLT5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMge30sXG4gICAgQUNNOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBhY20gX0FXUy5TREtcbiAgICBBU006XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGFzbSBfQVdTLlNES1xuICAgIENsb3VkRm9ybWF0aW9uOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjbG91ZGZvcm1hdGlvbiBfQVdTLlNES1xuICAgIENsb3VkRnJvbnQ6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNsb3VkZnJvbnQgX0FXUy5TREtcbiAgICBDbG91ZFdhdGNoTG9nczpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY2xvdWR3YXRjaGxvZ3MgX0FXUy5TREtcbiAgICBDb2duaXRvOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjb2duaXRvIF9BV1MuU0RLXG4gICAgRHluYW1vREI6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGR5bmFtb2RiIF9BV1MuU0RLXG4gICAgRUMyOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBlYzIgX0FXUy5TREtcbiAgICBLTVM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGttcyBfQVdTLlNES1xuICAgIExhbWJkYTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gbGFtYmRhIF9BV1MuU0RLXG4gICAgTmVwdHVuZTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gbmVwdHVuZSBfQVdTLlNES1xuICAgIFJvdXRlNTM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHJvdXRlNTMgX0FXUy5TREtcbiAgICBTMzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gczMgX0FXUy5TREtcbiAgICBTRVM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHNlcyBfQVdTLlNES1xuICAgIFNOUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc25zIF9BV1MuU0RLXG4gICAgU1FTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzcXMgX0FXUy5TREtcbiAgICBTdGVwRnVuY3Rpb25zOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzdGVwIF9BV1MuU0RLXG4gICAgU1RTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzdHMgX0FXUy5TREtcblxuZXhwb3J0IGRlZmF1bHQgUHJpbWl0aXZlc1xuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sundog/src/primitives/index.coffee