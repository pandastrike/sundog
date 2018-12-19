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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByaW1pdGl2ZXMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQWZBLElBQUEsVUFBQTs7QUFpQkEsVUFBQSxHQUFhLFVBQUEsSUFBQSxFQUFBO1NBQ1gsTUFBTSxDQUFOLGdCQUFBLENBQUEsRUFBQSxFQUNFO0FBQUEsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBREY7QUFHQSxJQUFBLGNBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsNkJBQWUsSUFBSSxDQUFuQixHQUFBLEM7QUFBSDtBQURMLEtBSkY7QUFNQSxJQUFBLFVBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcseUJBQVcsSUFBSSxDQUFmLEdBQUEsQztBQUFIO0FBREwsS0FQRjtBQVNBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyw2QkFBZSxJQUFJLENBQW5CLEdBQUEsQztBQUFIO0FBREwsS0FWRjtBQVlBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxzQkFBUSxJQUFJLENBQVosR0FBQSxDO0FBQUg7QUFETCxLQWJGO0FBZUEsSUFBQSxRQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHVCQUFTLElBQUksQ0FBYixHQUFBLEM7QUFBSDtBQURMLEtBaEJGO0FBa0JBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxpQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQW5CRjtBQXFCQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0F0QkY7QUF3QkEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLHFCQUFPLElBQUksQ0FBWCxHQUFBLEM7QUFBSDtBQURMLEtBekJGO0FBMkJBLElBQUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxzQkFBUSxJQUFJLENBQVosR0FBQSxDO0FBQUg7QUFETCxLQTVCRjtBQThCQSxJQUFBLE9BQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsb0JBQVEsSUFBSSxDQUFaLEdBQUEsQztBQUFIO0FBREwsS0EvQkY7QUFpQ0EsSUFBQSxFQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGdCQUFHLElBQUksQ0FBUCxHQUFBLEM7QUFBSDtBQURMLEtBbENGO0FBb0NBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxrQkFBSSxJQUFJLENBQVIsR0FBQSxDO0FBQUg7QUFETCxLQXJDRjtBQXVDQSxJQUFBLEdBQUEsRUFDRTtBQUFBLE1BQUEsVUFBQSxFQUFBLElBQUE7QUFDQSxNQUFBLEdBQUEsRUFBSyxZQUFBO2VBQUcsa0JBQUksSUFBSSxDQUFSLEdBQUEsQztBQUFIO0FBREwsS0F4Q0Y7QUEwQ0EsSUFBQSxHQUFBLEVBQ0U7QUFBQSxNQUFBLFVBQUEsRUFBQSxJQUFBO0FBQ0EsTUFBQSxHQUFBLEVBQUssWUFBQTtlQUFHLGtCQUFJLElBQUksQ0FBUixHQUFBLEM7QUFBSDtBQURMLEtBM0NGO0FBNkNBLElBQUEsR0FBQSxFQUNFO0FBQUEsTUFBQSxVQUFBLEVBQUEsSUFBQTtBQUNBLE1BQUEsR0FBQSxFQUFLLFlBQUE7ZUFBRyxtQjtBQUFIO0FBREw7QUE5Q0YsR0FERixDO0FBRFcsQ0FBYjs7ZUFtRGUsVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhY20gZnJvbSBcIi4vYWNtXCJcbmltcG9ydCBjbG91ZGZvcm1hdGlvbiBmcm9tIFwiLi9jbG91ZGZvcm1hdGlvblwiXG5pbXBvcnQgY2xvdWRmcm9udCBmcm9tIFwiLi9jbG91ZGZyb250XCJcbmltcG9ydCBjbG91ZHdhdGNobG9ncyBmcm9tIFwiLi9jbG91ZHdhdGNobG9nc1wiXG5pbXBvcnQgY29nbml0byBmcm9tIFwiLi9jb2duaXRvXCJcbmltcG9ydCBkeW5hbW9kYiBmcm9tIFwiLi9keW5hbW9kYlwiXG5pbXBvcnQgZWMyIGZyb20gXCIuL2VjMlwiXG5pbXBvcnQga21zIGZyb20gXCIuL2ttc1wiXG5pbXBvcnQgbGFtYmRhIGZyb20gXCIuL2xhbWJkYVwiXG5pbXBvcnQgbmVwdHVuZSBmcm9tIFwiLi9uZXB0dW5lXCJcbmltcG9ydCByb3V0ZTUzIGZyb20gXCIuL3JvdXRlNTNcIlxuaW1wb3J0IHMzIGZyb20gXCIuL3MzXCJcbmltcG9ydCBzZXMgZnJvbSBcIi4vc2VzXCJcbmltcG9ydCBzbnMgZnJvbSBcIi4vc25zXCJcbmltcG9ydCBzdHMgZnJvbSBcIi4vc3RzXCJcbmltcG9ydCB1cmwgZnJvbSBcIi4vdXJsXCIgICMgVVJMIHBhcnNpbmcgLyBmb3JtYXR0aW5nIGhlbHBlcnNcblxuUHJpbWl0aXZlcyA9IChfQVdTKSAtPlxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyB7fSxcbiAgICBBQ006XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGFjbSBfQVdTLlNES1xuICAgIENsb3VkRm9ybWF0aW9uOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjbG91ZGZvcm1hdGlvbiBfQVdTLlNES1xuICAgIENsb3VkRnJvbnQ6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGNsb3VkZnJvbnQgX0FXUy5TREtcbiAgICBDbG91ZFdhdGNoTG9nczpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gY2xvdWR3YXRjaGxvZ3MgX0FXUy5TREtcbiAgICBDb2duaXRvOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBjb2duaXRvIF9BV1MuU0RLXG4gICAgRHluYW1vREI6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGR5bmFtb2RiIF9BV1MuU0RLXG4gICAgRUMyOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBlYzIgX0FXUy5TREtcbiAgICBLTVM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IGttcyBfQVdTLlNES1xuICAgIExhbWJkYTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gbGFtYmRhIF9BV1MuU0RLXG4gICAgTmVwdHVuZTpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gbmVwdHVuZSBfQVdTLlNES1xuICAgIFJvdXRlNTM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHJvdXRlNTMgX0FXUy5TREtcbiAgICBTMzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gczMgX0FXUy5TREtcbiAgICBTRVM6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHNlcyBfQVdTLlNES1xuICAgIFNOUzpcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICAgIGdldDogLT4gc25zIF9BV1MuU0RLXG4gICAgU1RTOlxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgICAgZ2V0OiAtPiBzdHMgX0FXUy5TREtcbiAgICBVUkw6XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgICBnZXQ6IC0+IHVybCgpXG5cbmV4cG9ydCBkZWZhdWx0IFByaW1pdGl2ZXNcbiJdLCJzb3VyY2VSb290IjoiIn0=
//# sourceURL=primitives/index.coffee