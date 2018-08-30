import acm from "./acm"
import cloudformation from "./cloudformation"
import cloudfront from "./cloudfront"
import cloudwatchlogs from "./cloudwatchlogs"
import cognito from "./cognito"
import dynamodb from "./dynamodb"
import ec2 from "./ec2"
import kms from "./kms"
import lambda from "./lambda"
import s3 from "./s3"
import ses from "./ses"
import sns from "./sns"
import sts from "./sts"
import url from "./url"  # URL parsing / formatting helpers

Primitives = (_AWS) ->
  Object.defineProperties {},
    ACM:
      enumerable: true
      get: -> acm
    CloudFormation:
      enumerable: true
      get: -> cloudformation _AWS
    CloudFront:
      enumerable: true
      get: -> cloudfront _AWS
    CloudWatchLogs:
      enumerable: true
      get: -> cloudwatchlogs _AWS
    Cognito:
      enumerable: true
      get: -> cognito _AWS
    DynamoDB:
      enumerable: true
      get: -> dynamodb _AWS
    EC2:
      enumerable: true
      get: -> ec2 _AWS
    KMS:
      enumerable: true
      get: -> kms _AWS
    Lambda:
      enumerable: true
      get: -> lambda _AWS
    S3:
      enumerable: true
      get: -> s3 _AWS
    SES:
      enumerable: true
      get: -> ses _AWS
    SNS:
      enumerable: true
      get: -> sns _AWS
    STS:
      enumerable: true
      get: -> sts _AWS
    URL:
      enumerable: true
      get: -> url()

export default Primitives
