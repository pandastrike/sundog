import acm from "./acm"
import cloudformation from "./cloudformation"
import cloudfront from "./cloudfront"
import cloudwatchlogs from "./cloudwatchlogs"
import cognito from "./cognito"
import dynamodb from "./dynamodb"
import ec2 from "./ec2"
import kms from "./kms"
import lambda from "./lambda"
import route53 from "./route53"
import s3 from "./s3"
import ses from "./ses"
import sns from "./sns"
import sts from "./sts"
import url from "./url"  # URL parsing / formatting helpers

Primitives = (_AWS) ->
  Object.defineProperties {},
    ACM:
      enumerable: true
      get: -> acm _AWS.SDK
    CloudFormation:
      enumerable: true
      get: -> cloudformation _AWS.SDK
    CloudFront:
      enumerable: true
      get: -> cloudfront _AWS.SDK
    CloudWatchLogs:
      enumerable: true
      get: -> cloudwatchlogs _AWS.SDK
    Cognito:
      enumerable: true
      get: -> cognito _AWS.SDK
    DynamoDB:
      enumerable: true
      get: -> dynamodb _AWS.SDK
    EC2:
      enumerable: true
      get: -> ec2 _AWS.SDK
    KMS:
      enumerable: true
      get: -> kms _AWS.SDK
    Lambda:
      enumerable: true
      get: -> lambda _AWS.SDK
    Route53:
      enumerable: true
      get: -> route53 _AWS.SDK
    S3:
      enumerable: true
      get: -> s3 _AWS.SDK
    SES:
      enumerable: true
      get: -> ses _AWS.SDK
    SNS:
      enumerable: true
      get: -> sns _AWS.SDK
    STS:
      enumerable: true
      get: -> sts _AWS.SDK
    URL:
      enumerable: true
      get: -> url()

export default Primitives
