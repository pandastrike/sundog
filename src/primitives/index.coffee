import cognito from "./cognito"
import dynamodb from "./dynamodb"
import kms from "./kms"
import s3 from "./s3"
import ses from "./ses"
import sns from "./sns"
import sts from "./sts"

Primitives = (_AWS) ->
  Object.defineProperties {},
    Cognito:
      enumerable: true
      get: -> cognito _AWS
    DynamoDB:
      enumerable: true
      get: -> dynamodb _AWS
    KMS:
      enumerable: true
      get: -> kms _AWS
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

export default Primitives
