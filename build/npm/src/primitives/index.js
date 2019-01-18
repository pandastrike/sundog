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

var _url = _interopRequireDefault(require("./url"));

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
    },
    URL: {
      enumerable: true,
      get: function () {
        return (0, _url.default)();
      }
    }
  });
};

var _default = Primitives;
exports.default = _default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZC9SZXBvc2l0b3JpZXMvc3VuZG9nL3NyYy9wcmltaXRpdmVzL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7QUFmQSxJQUFBLFVBQUE7O0FBaUJBLFVBQUEsR0FBYSxVQUFBLElBQUEsRUFBQTtTQUNYLE1BQU0sQ0FBTixnQkFBQSxDQUFBLEVBQUEsRUFDRTtBQUFBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQURGO0FBR0EsSUFBQSxjQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLDZCQUFlLElBQUksQ0FBbkIsR0FBQSxDO0FBQUg7QUFETCxLQUpGO0FBTUEsSUFBQSxVQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHlCQUFXLElBQUksQ0FBZixHQUFBLEM7QUFBSDtBQURMLEtBUEY7QUFTQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsNkJBQWUsSUFBSSxDQUFuQixHQUFBLEM7QUFBSDtBQURMLEtBVkY7QUFZQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQVEsSUFBSSxDQUFaLEdBQUEsQztBQUFIO0FBREwsS0FiRjtBQWVBLElBQUEsUUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyx1QkFBUyxJQUFJLENBQWIsR0FBQSxDO0FBQUg7QUFETCxLQWhCRjtBQWtCQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsaUJBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0FuQkY7QUFxQkEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBdEJGO0FBd0JBLElBQUEsTUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxxQkFBTyxJQUFJLENBQVgsR0FBQSxDO0FBQUg7QUFETCxLQXpCRjtBQTJCQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsc0JBQVEsSUFBSSxDQUFaLEdBQUEsQztBQUFIO0FBREwsS0E1QkY7QUE4QkEsSUFBQSxPQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLG9CQUFRLElBQUksQ0FBWixHQUFBLEM7QUFBSDtBQURMLEtBL0JGO0FBaUNBLElBQUEsRUFBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxnQkFBRyxJQUFJLENBQVAsR0FBQSxDO0FBQUg7QUFETCxLQWxDRjtBQW9DQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0FyQ0Y7QUF1Q0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBeENGO0FBMENBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQTNDRjtBQTZDQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsbUI7QUFBSDtBQURMO0FBOUNGLEdBREYsQztBQURXLENBQWI7O2VBbURlLFUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYWNtIGZyb20gXCIuL2FjbVwiXG5pbXBvcnQgY2xvdWRmb3JtYXRpb24gZnJvbSBcIi4vY2xvdWRmb3JtYXRpb25cIlxuaW1wb3J0IGNsb3VkZnJvbnQgZnJvbSBcIi4vY2xvdWRmcm9udFwiXG5pbXBvcnQgY2xvdWR3YXRjaGxvZ3MgZnJvbSBcIi4vY2xvdWR3YXRjaGxvZ3NcIlxuaW1wb3J0IGNvZ25pdG8gZnJvbSBcIi4vY29nbml0b1wiXG5pbXBvcnQgZHluYW1vZGIgZnJvbSBcIi4vZHluYW1vZGJcIlxuaW1wb3J0IGVjMiBmcm9tIFwiLi9lYzJcIlxuaW1wb3J0IGttcyBmcm9tIFwiLi9rbXNcIlxuaW1wb3J0IGxhbWJkYSBmcm9tIFwiLi9sYW1iZGFcIlxuaW1wb3J0IG5lcHR1bmUgZnJvbSBcIi4vbmVwdHVuZVwiXG5pbXBvcnQgcm91dGU1MyBmcm9tIFwiLi9yb3V0ZTUzXCJcbmltcG9ydCBzMyBmcm9tIFwiLi9zM1wiXG5pbXBvcnQgc2VzIGZyb20gXCIuL3Nlc1wiXG5pbXBvcnQgc25zIGZyb20gXCIuL3Nuc1wiXG5pbXBvcnQgc3RzIGZyb20gXCIuL3N0c1wiXG5pbXBvcnQgdXJsIGZyb20gXCIuL3VybFwiICAjIFVSTCBwYXJzaW5nIC8gZm9ybWF0dGluZyBoZWxwZXJzXG5cblByaW1pdGl2ZXMgPSAoX0FXUykgLT5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMge30sXG4gICAgQUNNOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBhY20gX0FXUy5TREtcbiAgICBDbG91ZEZvcm1hdGlvbjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY2xvdWRmb3JtYXRpb24gX0FXUy5TREtcbiAgICBDbG91ZEZyb250OlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjbG91ZGZyb250IF9BV1MuU0RLXG4gICAgQ2xvdWRXYXRjaExvZ3M6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNsb3Vkd2F0Y2hsb2dzIF9BV1MuU0RLXG4gICAgQ29nbml0bzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY29nbml0byBfQVdTLlNES1xuICAgIER5bmFtb0RCOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBkeW5hbW9kYiBfQVdTLlNES1xuICAgIEVDMjpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gZWMyIF9BV1MuU0RLXG4gICAgS01TOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBrbXMgX0FXUy5TREtcbiAgICBMYW1iZGE6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGxhbWJkYSBfQVdTLlNES1xuICAgIE5lcHR1bmU6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IG5lcHR1bmUgX0FXUy5TREtcbiAgICBSb3V0ZTUzOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiByb3V0ZTUzIF9BV1MuU0RLXG4gICAgUzM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHMzIF9BV1MuU0RLXG4gICAgU0VTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzZXMgX0FXUy5TREtcbiAgICBTTlM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHNucyBfQVdTLlNES1xuICAgIFNUUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc3RzIF9BV1MuU0RLXG4gICAgVVJMOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiB1cmwoKVxuXG5leHBvcnQgZGVmYXVsdCBQcmltaXRpdmVzXG4iXSwic291cmNlUm9vdCI6IiJ9
//# sourceURL=/Users/david/Repositories/sundog/src/primitives/index.coffee