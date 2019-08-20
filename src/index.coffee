import {lift, liftService} from "./lift"
import Helpers from "./helpers"

import acm from "./primitives/acm"
import asm from "./primitives/asm"
import cloudformation from "./primitives/cloudformation"
import cloudfront from "./primitives/cloudfront"
import cloudwatchlogs from "./primitives/cloudwatchlogs"
import cognito from "./primitives/cognito"
import dynamodb from "./primitives/dynamodb"
import ec2 from "./primitives/ec2"
import iam from "./primitives/iam"
import kms from "./primitives/kms"
import lambda from "./primitives/lambda"
import route53 from "./primitives/route53"
import s3 from "./primitives/s3"
import ses from "./primitives/ses"
import sns from "./primitives/sns"
import sqs from "./primitives/sqs"
import step from "./primitives/step"
import sts from "./primitives/sts"

start = (options={}) ->
  Object.defineProperties {},
    ACM:
      enumerable: true
      get: -> acm options
    ASM:
      enumerable: true
      get: -> asm options
    CloudFormation:
      enumerable: true
      get: -> cloudformation options
    CloudFront:
      enumerable: true
      get: -> cloudfront options
    CloudWatchLogs:
      enumerable: true
      get: -> cloudwatchlogs options
    Cognito:
      enumerable: true
      get: -> cognito options
    DynamoDB:
      enumerable: true
      get: -> dynamodb options
    EC2:
      enumerable: true
      get: -> ec2 options
    IAM:
      enumerable: true
      get: -> iam options
    KMS:
      enumerable: true
      get: -> kms options
    Lambda:
      enumerable: true
      get: -> lambda options
    Route53:
      enumerable: true
      get: -> route53 options
    S3:
      enumerable: true
      get: -> s3 options
    SES:
      enumerable: true
      get: -> ses options
    SNS:
      enumerable: true
      get: -> sns options
    SQS:
      enumerable: true
      get: -> sqs options
    StepFunctions:
      enumerable: true
      get: -> step options
    STS:
      enumerable: true
      get: -> sts options

export default start
export {Helpers, lift, liftService}
