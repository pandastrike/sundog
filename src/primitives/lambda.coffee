import {cat} from "fairmont"

lambdaPrimitive = (_AWS) ->
  lambda = _AWS.Lambda

  update = (name, bucket, key) ->
    await lambda.updateFunctionCode
      FunctionName: name
      Publish: true
      S3Bucket: bucket
      S3Key: key

  list = (fns=[], marker) ->
    params = {MaxItems: 100}
    params.Marker = marker if marker

    {NextMarker, Functions} = await lambda.listFunctions params
    fns = cat fns, Functions
    if NextMarker
      await list fns, NextMarker
    else
      fns

  Delete = (name) -> await lambda.deleteFunction FunctionName: name

  {update, list, delete:Delete}


export default lambdaPrimitive
