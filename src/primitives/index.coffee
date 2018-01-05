import dynamodb from "./dynamodb"
import s3 from "./s3"

Primitives = (_AWS) ->
  Object.defineProperties {},
    DynamoDB:
      enumerable: true
      get: -> dynamodb _AWS
    S3:
      enumerable: true
      get: -> s3 _AWS

export default Primitives
