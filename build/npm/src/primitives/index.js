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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQWhCQSxJQUFBLFVBQUE7O0FBa0JBLFVBQUEsR0FBYSxVQUFBLElBQUEsRUFBQTtTQUNYLE1BQU0sQ0FBTixnQkFBQSxDQUFBLEVBQUEsRUFDRTtBQUFBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQURGO0FBR0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBSkY7QUFNQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsNkJBQWUsSUFBSSxDQUFuQixHQUFBLEM7QUFBSDtBQURMLEtBUEY7QUFTQSxJQUFBLFVBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcseUJBQVcsSUFBSSxDQUFmLEdBQUEsQztBQUFIO0FBREwsS0FWRjtBQVlBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyw2QkFBZSxJQUFJLENBQW5CLEdBQUEsQztBQUFIO0FBREwsS0FiRjtBQWVBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxzQkFBUSxJQUFJLENBQVosR0FBQSxDO0FBQUg7QUFETCxLQWhCRjtBQWtCQSxJQUFBLFFBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsdUJBQVMsSUFBSSxDQUFiLEdBQUEsQztBQUFIO0FBREwsS0FuQkY7QUFxQkEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGlCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBdEJGO0FBd0JBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQXpCRjtBQTJCQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcscUJBQU8sSUFBSSxDQUFYLEdBQUEsQztBQUFIO0FBREwsS0E1QkY7QUE4QkEsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHNCQUFRLElBQUksQ0FBWixHQUFBLEM7QUFBSDtBQURMLEtBL0JGO0FBaUNBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxvQkFBUSxJQUFJLENBQVosR0FBQSxDO0FBQUg7QUFETCxLQWxDRjtBQW9DQSxJQUFBLEVBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsZ0JBQUcsSUFBSSxDQUFQLEdBQUEsQztBQUFIO0FBREwsS0FyQ0Y7QUF1Q0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBeENGO0FBMENBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQTNDRjtBQTZDQSxJQUFBLGFBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsbUJBQUssSUFBSSxDQUFULEdBQUEsQztBQUFIO0FBREwsS0E5Q0Y7QUFnREEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMO0FBakRGLEdBREYsQztBQURXLENBQWI7O2VBc0RlLFUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYWNtIGZyb20gXCIuL2FjbVwiXG5pbXBvcnQgYXNtIGZyb20gXCIuL2FzbVwiXG5pbXBvcnQgY2xvdWRmb3JtYXRpb24gZnJvbSBcIi4vY2xvdWRmb3JtYXRpb25cIlxuaW1wb3J0IGNsb3VkZnJvbnQgZnJvbSBcIi4vY2xvdWRmcm9udFwiXG5pbXBvcnQgY2xvdWR3YXRjaGxvZ3MgZnJvbSBcIi4vY2xvdWR3YXRjaGxvZ3NcIlxuaW1wb3J0IGNvZ25pdG8gZnJvbSBcIi4vY29nbml0b1wiXG5pbXBvcnQgZHluYW1vZGIgZnJvbSBcIi4vZHluYW1vZGJcIlxuaW1wb3J0IGVjMiBmcm9tIFwiLi9lYzJcIlxuaW1wb3J0IGttcyBmcm9tIFwiLi9rbXNcIlxuaW1wb3J0IGxhbWJkYSBmcm9tIFwiLi9sYW1iZGFcIlxuaW1wb3J0IG5lcHR1bmUgZnJvbSBcIi4vbmVwdHVuZVwiXG5pbXBvcnQgcm91dGU1MyBmcm9tIFwiLi9yb3V0ZTUzXCJcbmltcG9ydCBzMyBmcm9tIFwiLi9zM1wiXG5pbXBvcnQgc2VzIGZyb20gXCIuL3Nlc1wiXG5pbXBvcnQgc25zIGZyb20gXCIuL3Nuc1wiXG5pbXBvcnQgc3RlcCBmcm9tIFwiLi9zdGVwXCJcbmltcG9ydCBzdHMgZnJvbSBcIi4vc3RzXCJcblxuUHJpbWl0aXZlcyA9IChfQVdTKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyB7fSxcbiAgICBBQ006XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGFjbSBfQVdTLlNES1xuICAgIEFTTTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gYXNtIF9BV1MuU0RLXG4gICAgQ2xvdWRGb3JtYXRpb246XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNsb3VkZm9ybWF0aW9uIF9BV1MuU0RLXG4gICAgQ2xvdWRGcm9udDpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY2xvdWRmcm9udCBfQVdTLlNES1xuICAgIENsb3VkV2F0Y2hMb2dzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjbG91ZHdhdGNobG9ncyBfQVdTLlNES1xuICAgIENvZ25pdG86XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNvZ25pdG8gX0FXUy5TREtcbiAgICBEeW5hbW9EQjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gZHluYW1vZGIgX0FXUy5TREtcbiAgICBFQzI6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGVjMiBfQVdTLlNES1xuICAgIEtNUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4ga21zIF9BV1MuU0RLXG4gICAgTGFtYmRhOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBsYW1iZGEgX0FXUy5TREtcbiAgICBOZXB0dW5lOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBuZXB0dW5lIF9BV1MuU0RLXG4gICAgUm91dGU1MzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gcm91dGU1MyBfQVdTLlNES1xuICAgIFMzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzMyBfQVdTLlNES1xuICAgIFNFUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc2VzIF9BV1MuU0RLXG4gICAgU05TOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzbnMgX0FXUy5TREtcbiAgICBTdGVwRnVuY3Rpb25zOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzdGVwIF9BV1MuU0RLXG4gICAgU1RTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzdHMgX0FXUy5TREtcblxuZXhwb3J0IGRlZmF1bHQgUHJpbWl0aXZlc1xuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sundog/src/primitives/index.coffee