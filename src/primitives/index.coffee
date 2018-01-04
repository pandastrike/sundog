import dynamodb from "./dynamodb"
import s3 from "./s3"

Primitives = (_AWS) ->
  DynamoDB = dynamodb _AWS
  S3 = s3 _AWS
  {DynamoDB, S3}

export default Primitives
