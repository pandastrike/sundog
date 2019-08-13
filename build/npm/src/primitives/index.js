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

var _iam = _interopRequireDefault(require("./iam"));

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

Primitives = function (_AWS, rawSDK) {
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
    IAM: {
      enumerable: true,
      get: function () {
        return (0, _iam.default)(_AWS.SDK);
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
        return (0, _s.default)(_AWS.SDK, rawSDK);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL3ByaW1pdGl2ZXMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQWxCQSxJQUFBLFVBQUE7O0FBb0JBLFVBQUEsR0FBYSxVQUFBLElBQUEsRUFBQSxNQUFBLEVBQUE7U0FDWCxNQUFNLENBQU4sZ0JBQUEsQ0FBQSxFQUFBLEVBQ0U7QUFBQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0FERjtBQUdBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQUpGO0FBTUEsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLDZCQUFlLElBQUksQ0FBbkIsR0FBQSxDO0FBQUg7QUFETCxLQVBGO0FBU0EsSUFBQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHlCQUFXLElBQUksQ0FBZixHQUFBLEM7QUFBSDtBQURMLEtBVkY7QUFZQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsNkJBQWUsSUFBSSxDQUFuQixHQUFBLEM7QUFBSDtBQURMLEtBYkY7QUFlQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQVEsSUFBSSxDQUFaLEdBQUEsQztBQUFIO0FBREwsS0FoQkY7QUFrQkEsSUFBQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHVCQUFTLElBQUksQ0FBYixHQUFBLEM7QUFBSDtBQURMLEtBbkJGO0FBcUJBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxpQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQXRCRjtBQXdCQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0F6QkY7QUEyQkEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBNUJGO0FBOEJBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxxQkFBTyxJQUFJLENBQVgsR0FBQSxDO0FBQUg7QUFETCxLQS9CRjtBQWlDQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQVEsSUFBSSxDQUFaLEdBQUEsQztBQUFIO0FBREwsS0FsQ0Y7QUFvQ0EsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLG9CQUFRLElBQUksQ0FBWixHQUFBLEM7QUFBSDtBQURMLEtBckNGO0FBdUNBLElBQUEsRUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxnQkFBRyxJQUFJLENBQVAsR0FBQSxFQUFBLE1BQUEsQztBQUFIO0FBREwsS0F4Q0Y7QUEwQ0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBM0NGO0FBNkNBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQTlDRjtBQWdEQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0FqREY7QUFtREEsSUFBQSxhQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLG1CQUFLLElBQUksQ0FBVCxHQUFBLEM7QUFBSDtBQURMLEtBcERGO0FBc0RBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETDtBQXZERixHQURGLEM7QUFEVyxDQUFiOztlQTREZSxVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFjbSBmcm9tIFwiLi9hY21cIlxuaW1wb3J0IGFzbSBmcm9tIFwiLi9hc21cIlxuaW1wb3J0IGNsb3VkZm9ybWF0aW9uIGZyb20gXCIuL2Nsb3VkZm9ybWF0aW9uXCJcbmltcG9ydCBjbG91ZGZyb250IGZyb20gXCIuL2Nsb3VkZnJvbnRcIlxuaW1wb3J0IGNsb3Vkd2F0Y2hsb2dzIGZyb20gXCIuL2Nsb3Vkd2F0Y2hsb2dzXCJcbmltcG9ydCBjb2duaXRvIGZyb20gXCIuL2NvZ25pdG9cIlxuaW1wb3J0IGR5bmFtb2RiIGZyb20gXCIuL2R5bmFtb2RiXCJcbmltcG9ydCBlYzIgZnJvbSBcIi4vZWMyXCJcbmltcG9ydCBpYW0gZnJvbSBcIi4vaWFtXCJcbmltcG9ydCBrbXMgZnJvbSBcIi4va21zXCJcbmltcG9ydCBsYW1iZGEgZnJvbSBcIi4vbGFtYmRhXCJcbmltcG9ydCBuZXB0dW5lIGZyb20gXCIuL25lcHR1bmVcIlxuaW1wb3J0IHJvdXRlNTMgZnJvbSBcIi4vcm91dGU1M1wiXG5pbXBvcnQgczMgZnJvbSBcIi4vczNcIlxuaW1wb3J0IHNlcyBmcm9tIFwiLi9zZXNcIlxuaW1wb3J0IHNucyBmcm9tIFwiLi9zbnNcIlxuaW1wb3J0IHNxcyBmcm9tIFwiLi9zcXNcIlxuaW1wb3J0IHN0ZXAgZnJvbSBcIi4vc3RlcFwiXG5pbXBvcnQgc3RzIGZyb20gXCIuL3N0c1wiXG5cblByaW1pdGl2ZXMgPSAoX0FXUywgcmF3U0RLKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyB7fSxcbiAgICBBQ006XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGFjbSBfQVdTLlNES1xuICAgIEFTTTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gYXNtIF9BV1MuU0RLXG4gICAgQ2xvdWRGb3JtYXRpb246XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNsb3VkZm9ybWF0aW9uIF9BV1MuU0RLXG4gICAgQ2xvdWRGcm9udDpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY2xvdWRmcm9udCBfQVdTLlNES1xuICAgIENsb3VkV2F0Y2hMb2dzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjbG91ZHdhdGNobG9ncyBfQVdTLlNES1xuICAgIENvZ25pdG86XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNvZ25pdG8gX0FXUy5TREtcbiAgICBEeW5hbW9EQjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gZHluYW1vZGIgX0FXUy5TREtcbiAgICBFQzI6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGVjMiBfQVdTLlNES1xuICAgIElBTTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gaWFtIF9BV1MuU0RLXG4gICAgS01TOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBrbXMgX0FXUy5TREtcbiAgICBMYW1iZGE6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGxhbWJkYSBfQVdTLlNES1xuICAgIE5lcHR1bmU6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IG5lcHR1bmUgX0FXUy5TREtcbiAgICBSb3V0ZTUzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiByb3V0ZTUzIF9BV1MuU0RLXG4gICAgUzM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHMzIF9BV1MuU0RLLCByYXdTREtcbiAgICBTRVM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHNlcyBfQVdTLlNES1xuICAgIFNOUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc25zIF9BV1MuU0RLXG4gICAgU1FTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzcXMgX0FXUy5TREtcbiAgICBTdGVwRnVuY3Rpb25zOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzdGVwIF9BV1MuU0RLXG4gICAgU1RTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzdHMgX0FXUy5TREtcblxuZXhwb3J0IGRlZmF1bHQgUHJpbWl0aXZlc1xuIl0sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=/Users/david/repos/sundog/src/primitives/index.coffee