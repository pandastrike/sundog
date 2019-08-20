"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "lift", {
  enumerable: true,
  get: function () {
    return _lift.lift;
  }
});
Object.defineProperty(exports, "liftService", {
  enumerable: true,
  get: function () {
    return _lift.liftService;
  }
});
Object.defineProperty(exports, "Helpers", {
  enumerable: true,
  get: function () {
    return _helpers.default;
  }
});
exports.default = void 0;

var _lift = require("./lift");

var _helpers = _interopRequireDefault(require("./helpers"));

var _acm = _interopRequireDefault(require("./primitives/acm"));

var _asm = _interopRequireDefault(require("./primitives/asm"));

var _cloudformation = _interopRequireDefault(require("./primitives/cloudformation"));

var _cloudfront = _interopRequireDefault(require("./primitives/cloudfront"));

var _cloudwatchlogs = _interopRequireDefault(require("./primitives/cloudwatchlogs"));

var _cognito = _interopRequireDefault(require("./primitives/cognito"));

var _dynamodb = _interopRequireDefault(require("./primitives/dynamodb"));

var _ec = _interopRequireDefault(require("./primitives/ec2"));

var _iam = _interopRequireDefault(require("./primitives/iam"));

var _kms = _interopRequireDefault(require("./primitives/kms"));

var _lambda = _interopRequireDefault(require("./primitives/lambda"));

var _route = _interopRequireDefault(require("./primitives/route53"));

var _s = _interopRequireDefault(require("./primitives/s3"));

var _ses = _interopRequireDefault(require("./primitives/ses"));

var _sns = _interopRequireDefault(require("./primitives/sns"));

var _sqs = _interopRequireDefault(require("./primitives/sqs"));

var _step = _interopRequireDefault(require("./primitives/step"));

var _sts = _interopRequireDefault(require("./primitives/sts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var start;

start = function (options = {}) {
  return Object.defineProperties({}, {
    ACM: {
      enumerable: true,
      get: function () {
        return (0, _acm.default)(options);
      }
    },
    ASM: {
      enumerable: true,
      get: function () {
        return (0, _asm.default)(options);
      }
    },
    CloudFormation: {
      enumerable: true,
      get: function () {
        return (0, _cloudformation.default)(options);
      }
    },
    CloudFront: {
      enumerable: true,
      get: function () {
        return (0, _cloudfront.default)(options);
      }
    },
    CloudWatchLogs: {
      enumerable: true,
      get: function () {
        return (0, _cloudwatchlogs.default)(options);
      }
    },
    Cognito: {
      enumerable: true,
      get: function () {
        return (0, _cognito.default)(options);
      }
    },
    DynamoDB: {
      enumerable: true,
      get: function () {
        return (0, _dynamodb.default)(options);
      }
    },
    EC2: {
      enumerable: true,
      get: function () {
        return (0, _ec.default)(options);
      }
    },
    IAM: {
      enumerable: true,
      get: function () {
        return (0, _iam.default)(options);
      }
    },
    KMS: {
      enumerable: true,
      get: function () {
        return (0, _kms.default)(options);
      }
    },
    Lambda: {
      enumerable: true,
      get: function () {
        return (0, _lambda.default)(options);
      }
    },
    Route53: {
      enumerable: true,
      get: function () {
        return (0, _route.default)(options);
      }
    },
    S3: {
      enumerable: true,
      get: function () {
        return (0, _s.default)(options);
      }
    },
    SES: {
      enumerable: true,
      get: function () {
        return (0, _ses.default)(options);
      }
    },
    SNS: {
      enumerable: true,
      get: function () {
        return (0, _sns.default)(options);
      }
    },
    SQS: {
      enumerable: true,
      get: function () {
        return (0, _sqs.default)(options);
      }
    },
    StepFunctions: {
      enumerable: true,
      get: function () {
        return (0, _step.default)(options);
      }
    },
    STS: {
      enumerable: true,
      get: function () {
        return (0, _sts.default)(options);
      }
    }
  });
};

var _default = start;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9yZXBvcy9zdW5kb2cvc3JjL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFwQkEsSUFBQSxLQUFBOztBQXNCQSxLQUFBLEdBQVEsVUFBQyxPQUFBLEdBQUQsRUFBQSxFQUFBO1NBQ04sTUFBTSxDQUFOLGdCQUFBLENBQUEsRUFBQSxFQUNFO0FBQUEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFBLE9BQUEsQztBQUFIO0FBREwsS0FERjtBQUdBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBQSxPQUFBLEM7QUFBSDtBQURMLEtBSkY7QUFNQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsNkJBQUEsT0FBQSxDO0FBQUg7QUFETCxLQVBGO0FBU0EsSUFBQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHlCQUFBLE9BQUEsQztBQUFIO0FBREwsS0FWRjtBQVlBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyw2QkFBQSxPQUFBLEM7QUFBSDtBQURMLEtBYkY7QUFlQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQUEsT0FBQSxDO0FBQUg7QUFETCxLQWhCRjtBQWtCQSxJQUFBLFFBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsdUJBQUEsT0FBQSxDO0FBQUg7QUFETCxLQW5CRjtBQXFCQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsaUJBQUEsT0FBQSxDO0FBQUg7QUFETCxLQXRCRjtBQXdCQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUEsT0FBQSxDO0FBQUg7QUFETCxLQXpCRjtBQTJCQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUEsT0FBQSxDO0FBQUg7QUFETCxLQTVCRjtBQThCQSxJQUFBLE1BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcscUJBQUEsT0FBQSxDO0FBQUg7QUFETCxLQS9CRjtBQWlDQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsb0JBQUEsT0FBQSxDO0FBQUg7QUFETCxLQWxDRjtBQW9DQSxJQUFBLEVBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsZ0JBQUEsT0FBQSxDO0FBQUg7QUFETCxLQXJDRjtBQXVDQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUEsT0FBQSxDO0FBQUg7QUFETCxLQXhDRjtBQTBDQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUEsT0FBQSxDO0FBQUg7QUFETCxLQTNDRjtBQTZDQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUEsT0FBQSxDO0FBQUg7QUFETCxLQTlDRjtBQWdEQSxJQUFBLGFBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsbUJBQUEsT0FBQSxDO0FBQUg7QUFETCxLQWpERjtBQW1EQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUEsT0FBQSxDO0FBQUg7QUFETDtBQXBERixHQURGLEM7QUFETSxDQUFSOztlQXlEZSxLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtsaWZ0LCBsaWZ0U2VydmljZX0gZnJvbSBcIi4vbGlmdFwiXG5pbXBvcnQgSGVscGVycyBmcm9tIFwiLi9oZWxwZXJzXCJcblxuaW1wb3J0IGFjbSBmcm9tIFwiLi9wcmltaXRpdmVzL2FjbVwiXG5pbXBvcnQgYXNtIGZyb20gXCIuL3ByaW1pdGl2ZXMvYXNtXCJcbmltcG9ydCBjbG91ZGZvcm1hdGlvbiBmcm9tIFwiLi9wcmltaXRpdmVzL2Nsb3VkZm9ybWF0aW9uXCJcbmltcG9ydCBjbG91ZGZyb250IGZyb20gXCIuL3ByaW1pdGl2ZXMvY2xvdWRmcm9udFwiXG5pbXBvcnQgY2xvdWR3YXRjaGxvZ3MgZnJvbSBcIi4vcHJpbWl0aXZlcy9jbG91ZHdhdGNobG9nc1wiXG5pbXBvcnQgY29nbml0byBmcm9tIFwiLi9wcmltaXRpdmVzL2NvZ25pdG9cIlxuaW1wb3J0IGR5bmFtb2RiIGZyb20gXCIuL3ByaW1pdGl2ZXMvZHluYW1vZGJcIlxuaW1wb3J0IGVjMiBmcm9tIFwiLi9wcmltaXRpdmVzL2VjMlwiXG5pbXBvcnQgaWFtIGZyb20gXCIuL3ByaW1pdGl2ZXMvaWFtXCJcbmltcG9ydCBrbXMgZnJvbSBcIi4vcHJpbWl0aXZlcy9rbXNcIlxuaW1wb3J0IGxhbWJkYSBmcm9tIFwiLi9wcmltaXRpdmVzL2xhbWJkYVwiXG5pbXBvcnQgcm91dGU1MyBmcm9tIFwiLi9wcmltaXRpdmVzL3JvdXRlNTNcIlxuaW1wb3J0IHMzIGZyb20gXCIuL3ByaW1pdGl2ZXMvczNcIlxuaW1wb3J0IHNlcyBmcm9tIFwiLi9wcmltaXRpdmVzL3Nlc1wiXG5pbXBvcnQgc25zIGZyb20gXCIuL3ByaW1pdGl2ZXMvc25zXCJcbmltcG9ydCBzcXMgZnJvbSBcIi4vcHJpbWl0aXZlcy9zcXNcIlxuaW1wb3J0IHN0ZXAgZnJvbSBcIi4vcHJpbWl0aXZlcy9zdGVwXCJcbmltcG9ydCBzdHMgZnJvbSBcIi4vcHJpbWl0aXZlcy9zdHNcIlxuXG5zdGFydCA9IChvcHRpb25zPXt9KSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyB7fSxcbiAgICBBQ006XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGFjbSBvcHRpb25zXG4gICAgQVNNOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBhc20gb3B0aW9uc1xuICAgIENsb3VkRm9ybWF0aW9uOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjbG91ZGZvcm1hdGlvbiBvcHRpb25zXG4gICAgQ2xvdWRGcm9udDpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY2xvdWRmcm9udCBvcHRpb25zXG4gICAgQ2xvdWRXYXRjaExvZ3M6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNsb3Vkd2F0Y2hsb2dzIG9wdGlvbnNcbiAgICBDb2duaXRvOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjb2duaXRvIG9wdGlvbnNcbiAgICBEeW5hbW9EQjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gZHluYW1vZGIgb3B0aW9uc1xuICAgIEVDMjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gZWMyIG9wdGlvbnNcbiAgICBJQU06XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGlhbSBvcHRpb25zXG4gICAgS01TOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBrbXMgb3B0aW9uc1xuICAgIExhbWJkYTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gbGFtYmRhIG9wdGlvbnNcbiAgICBSb3V0ZTUzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiByb3V0ZTUzIG9wdGlvbnNcbiAgICBTMzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gczMgb3B0aW9uc1xuICAgIFNFUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc2VzIG9wdGlvbnNcbiAgICBTTlM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHNucyBvcHRpb25zXG4gICAgU1FTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzcXMgb3B0aW9uc1xuICAgIFN0ZXBGdW5jdGlvbnM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHN0ZXAgb3B0aW9uc1xuICAgIFNUUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc3RzIG9wdGlvbnNcblxuZXhwb3J0IGRlZmF1bHQgc3RhcnRcbmV4cG9ydCB7SGVscGVycywgbGlmdCwgbGlmdFNlcnZpY2V9XG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/repos/sundog/src/index.coffee