import {cat, merge} from "panda-parchment"
import {applyConfiguration} from "../lift"

lambdaPrimitive = (SDK) ->
  (configuration) ->
    lambda = applyConfiguration configuration, SDK.Lambda

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

    invoke = (FunctionName, input, options) ->
      params = {
        FunctionName
        Payload: JSON.stringify input
      }
      params = merge params, options
      await lambda.invoke params

    asyncInvoke = (name, input, options) ->
      options = merge options, {InvocationType: "Event"}
      invoke name, input, options


    {update, list, delete:Delete, invoke, asyncInvoke}


export default lambdaPrimitive
