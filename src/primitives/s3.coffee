# Primitives for the service S3.  The main entities are buckets and objects.
# This follows the naming convention that methods that work on buckets will be
# prefixed "bucket*", whereas object methods will have no prefix.

import {createReadStream} from "fs"
import {curry, sleep, read, md5, cat} from "fairmont"
import mime from "mime"

import {notFound} from "./utils"

S3 = (_AWS) ->
  {S3: s3} = _AWS

  bucketExists = (name) ->
    try
      await s3.headBucket Bucket: name
      true
    catch e
      notFound e

  exists = curry (name, key) ->
    try
      await s3.headObject {Bucket: name, Key: key}
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
      await list name, objects, NextContinuationToken
    else
      cat items, Contents


  {bucketExists, exists, bucketTouch, touch, put, get, del, bucketDel, list}


export default S3
