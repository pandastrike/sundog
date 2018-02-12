# Primitives for the service Cognito.  The base entity is the "user".  Methods that act on other entities, like pools or clients are prefixed as such.

import {cat, collect, where} from "fairmont"

cognitoPrimative = (_AWS) ->
  cog = _AWS.CognitoIdentityServiceProvider

  poolList = (current=[], token) ->
    params = MaxResults: 60
    params.NextToken = token if token
    {UserPools, NextToken} = await cog.listUserPools params
    current = cat current, UserPools
    if NextToken
      await poolList current, NextToken
    else
      current

  poolGet = (name) ->
    {Id} = collect where Name: name, await poolList()
    if !Id
      return false
    else
      await cog.describeUserPool UserPoolId: Id

  {poolList, poolGet}


  # exists = curry (name, key) ->
  #   try
  #     await s3.headObject {Bucket: name, Key: key}
  #     true
  #   catch e
  #     notFound e
  #
  # bucketTouch = (name) ->
  #   return true if await bucketExists name
  #   await s3.createBucket {Bucket: name}
  #   await sleep 15000 # race condition with S3 API.  Wait to be available.
  #
  # put = curry (name, key, data, filetype) ->
  #   if filetype
  #     # here, data is stringified data.
  #     content = body = new Buffer data
  #   else
  #     # here, data is a path to file.
  #     filetype = mime.lookup data
  #     body = createReadStream data
  #     content =
  #       if "text" in mime.lookup(data)
  #         await read data
  #       else
  #         await read data, "buffer"
  #
  #   params =
  #     Bucket: name
  #     Key: key
  #     ContentType: filetype
  #     ContentMD5: new Buffer(md5(content), "hex").toString('base64')
  #     Body: body
  #
  #   await s3.putObject params
  #
  # get = curry (name, key, encoding="utf8") ->
  #   try
  #     {Body} = await s3.getObject {Bucket: name, Key: key}
  #     Body.toString encoding
  #   catch e
  #     notFound e
  #
  # del = curry (name, key) ->
  #   try
  #     await s3.deleteObject {Bucket: name, Key: key}
  #   catch e
  #     notFound e
  #
  # bucketDel = (name) ->
  #   try
  #     await s3.deleteBucket Bucket: name
  #   catch e
  #     notFound e
  #
  # list = curry (name, items=[], marker) ->
  #   p = {Bucket: name, MaxKeys: 1000}
  #   p.ContinuationToken = marker if marker
  #
  #   {IsTruncated, Contents, NextContinuationToken} = await s3.listObjectsV2 p
  #   if IsTruncated
  #     items = cat items, Contents
  #     await list name, items, NextContinuationToken
  #   else
  #     cat items, Contents
  #
  # # TODO: make this more efficient by throttling to X connections at once. AWS
  # # only supports N requests per second from an account, and I don't want this
  # # to violate that limit, but we can do better than one at a time.
  # bucketEmpty = (name) ->
  #   items = await list name
  #   await del name, i.Key for i in items


export default cognitoPrimative