import cognito from "./cognito"
import dynamodb from "./dynamodb"
import s3 from "./s3"
import sts from "./sts"

Primitives = (_AWS) ->
  Object.defineProperties {},
    Cognito:
      enumerable: true
      get: -> cognito _AWS
    DynamoDB:
      enumerable: true
      get: -> dynamodb _AWS
    S3:
      enumerable: true
      get: -> s3 _AWS
    STS:
      enumerable: true
      get: -> sts _AWS

export default Primitives
