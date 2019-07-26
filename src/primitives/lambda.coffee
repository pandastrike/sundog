import {cat, merge, toJSON} from "panda-parchment"
import {applyConfiguration} from "../lift"

lambdaPrimitive = (SDK) ->
  (configuration) ->
    lambda = applyConfiguration configuration, SDK.Lambda

    update = (name, bucket, key, options={}) ->
      await lambda.updateFunctionCode merge
        FunctionName: name
        Publish: false
        S3Bucket: bucket
        S3Key: key
        ,
        options

    updateConfig = (FunctionName, config) ->
      await lambda.updateFunctionConfiguration merge {FunctionName}, config

    list = (fns=[], marker) ->
      params = {MaxItems: 100}
      params.Marker = marker if marker

      {NextMarker, Functions} = await lambda.listFunctions params
      fns = cat fns, Functions
      if NextMarker
        await list fns, NextMarker
      else
        fns

    get = (name) -> lambda.getFunction FunctionName:name

    Delete = (name) -> await lambda.deleteFunction FunctionName: name

    invoke = (name, input, options) ->
      lambda.invoke merge
        FunctionName: name
        Payload: toJSON input
        options

    asyncInvoke = (name, input, options) ->
      invoke name, input, merge options, InvocationType: "Event"


    {update, updateConfig, list, get, delete:Delete, invoke, asyncInvoke}


export default lambdaPrimitive
