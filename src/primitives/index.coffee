import acm from "./acm"
import asm from "./asm"
import cloudformation from "./cloudformation"
import cloudfront from "./cloudfront"
import cloudwatchlogs from "./cloudwatchlogs"
import cognito from "./cognito"
import dynamodb from "./dynamodb"
import ec2 from "./ec2"
import kms from "./kms"
import lambda from "./lambda"
import neptune from "./neptune"
import route53 from "./route53"
import s3 from "./s3"
import ses from "./ses"
import sns from "./sns"
import sqs from "./sqs"
import step from "./step"
import sts from "./sts"

Primitives = (_AWS, rawSDK) ->
  Object.defineProperties {},
    ACM:
      enumerable: true
      get: -> acm _AWS.SDK
    ASM:
      enumerable: true
      get: -> asm _AWS.SDK
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
    Neptune:
      enumerable: true
      get: -> neptune _AWS.SDK
    Route53:
      enumerable: true
      get: -> route53 _AWS.SDK
    S3:
      enumerable: true
      get: -> s3 _AWS.SDK, rawSDK
    SES:
      enumerable: true
      get: -> ses _AWS.SDK
    SNS:
      enumerable: true
      get: -> sns _AWS.SDK
    SQS:
      enumerable: true
      get: -> sqs _AWS.SDK
    StepFunctions:
      enumerable: true
      get: -> step _AWS.SDK
    STS:
      enumerable: true
      get: -> sts _AWS.SDK

export default Primitives
