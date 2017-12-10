import s3 from "./s3"

Primitives = (_AWS) ->
  S3 = s3 _AWS
  {S3}

export default Primitives
