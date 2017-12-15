# Primitives for the service DynamoDB.
# The main entities are Tables and Items.
# This follows the naming convention that methods that work on Tables will be
# prefixed "table*", whereas item methods will have no prefix.

import {curry, sleep, first, keys, values} from "fairmont"
import mime from "mime"

import {notFound} from "./utils"

DynamoDB = (_AWS) ->
  {DynamoDB: db} = _AWS

  #===========================================================================
  # Tables
  #===========================================================================

  tableGet = (name) ->
    try
      {Table} = await db.describeTable TableName: name
      Table
    catch e
      notFound e

  #===========================================================================
  # Items
  #===========================================================================

  # Helpers to deal with DynamoDB attribute types
  toS = (s) -> S: s
  toN = (n) -> N: n.toString()
  toB = (b) -> B: b.toString()
  toSS = (a) -> SS: a
  toNS = (a) ->
    a[i] = v.toString for v, i in a
    NS: a
  toBS = (a) ->
    a[i] = v.toString for v, i in a
    BS: a
  toM = (m) -> M: m
  toL = (l) -> L: l
  toNull = (n) -> NULL: n
  toBool = (b) -> BOOL: b

  parse = (attributes) ->
    result = {}
    for name, typeObj of attributes
      dataType = first keys typeObj
      v = first values typeObj
      switch dataType
        when "S", "SS", "L", "BOOL" then v
        when "N" then number v
        when "B" then v = new Buffer v
        when "NS" then v[i] = number item for item, i in v
        when "BS" then v[i] = new Buffer item for item, i in v
        when "NULL" then v = !v
        when "M" then v[k] = parse _v for k, _v of v
        else
          throw new Error "Unable to parse object for DynamoDB attribute type."
      result[name] = v
    result

  get = curry (name, key, options={}) ->
    try
      {projectionExpression, consistentRead, returnConsumedCapacity} = options
      p = {TableName: name, Key: key}
      p.ProjectionExpression = projectionExpression if projectionExpression
      p.ConsistentRead = true if consistentRead
      p.ReturnConsumedCapacity = true if returnConsumedCapacity

      {Item, ConsumedCapacity} = await db.getItem p
      Item.ConsumedCapacity = ConsumedCapacity
      Item
    catch e
      notFound e





  bucketTouch = (name) ->
    return true if await bucketExists name
    await s3.createBucket {Bucket: name}
    await sleep 15000 # race condition with S3 API.  Wait to be available.

  put = curry (name, key, data, filetype) ->
    if filetype
      # here, data is stringified data.
      content = body = new Buffer data
    else
      # here, data is a path to file.
      filetype = mime.lookup data
      body = createReadStream data
      content =
        if "text" in mime.lookup(data)
          await read data
        else
          await read data, "buffer"

    params =
      Bucket: name
      Key: key
      ContentType: filetype
      ContentMD5: new Buffer(md5(content), "hex").toString('base64')
      Body: body

    await s3.putObject params

  get = curry (name, key, encoding="utf8") ->
    try
      {Body} = await s3.getObject {Bucket: name, Key: key}
      Body.toString encoding
    catch e
      notFound e

  del = curry (name, key) ->
    try
      await s3.deleteObject {Bucket: name, Key: key}
    catch e
      notFound e

  bucketDel = (name) ->
    try
      await s3.deleteBucket Bucket: name
    catch e
      notFound e

  list = curry (name, items=[], marker) ->
    p = {Bucket: name, MaxKeys: 1000}
    p.ContinuationToken = marker if marker

    {IsTruncated, Contents, NextContinuationToken} = await s3.listObjectsV2 p
    if IsTruncated
      items = cat items, Contents
      await list name, items, NextContinuationToken
    else
      cat items, Contents

  # TODO: make this more efficient by throttling to X connections at once. AWS
  # only supports N requests per second from an account, and I don't want this
  # to violate that limit, but we can do better than one at a time.
  bucketEmpty = (name) ->
    items = await list name
    await del name, i.Key for i in items



export default DynamoDB
