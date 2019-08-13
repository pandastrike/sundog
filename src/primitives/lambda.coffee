import {cat, merge, toJSON} from "panda-parchment"
import {applyConfiguration} from "../lift"

lambdaPrimitive = (SDK) ->
  (configuration) ->
    lambda = applyConfiguration configuration, SDK.Lambda

    create = (params) ->
      await lambda.createFunction params

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

    listVersions = (name, results=[], marker) ->
      {Versions, NextMarker} = await lambda.listVersionsByFunction
        FunctionName: name
        Marker: marker

      results = cat results, Versions

      if NextMarker?
        listVersions name, results, NextMarker
      else
        results





    get = (name) ->
      try
        await lambda.getFunction FunctionName:name
      catch
        false

    publish = (FunctionName, options={}) ->
      await lambda.publishVersion merge {FunctionName}, options

    Delete = (name) -> await lambda.deleteFunction FunctionName: name

    invoke = (name, input, options) ->
      lambda.invoke merge
        FunctionName: name
        Payload: toJSON input
        options

    asyncInvoke = (name, input, options) ->
      invoke name, input, merge options, InvocationType: "Event"


    {create, update, updateConfig, get, publish, list, listVersions, delete:Delete, invoke, asyncInvoke}


export default lambdaPrimitive
