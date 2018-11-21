# Primitives for the service S3.  The main entities are buckets and objects.
# This follows the naming convention that methods that work on buckets will be
# prefixed "bucket*", whereas object methods will have no prefix.

import {createReadStream} from "fs"
import Crypto from "crypto"
import {curry} from "panda-garden"
import {sleep, cat, merge} from "panda-parchment"
import {read} from "panda-quill"
import mime from "mime"

import {notFound} from "./utils"
import {applyConfiguration} from "../lift"

md5 = (string) ->
  Crypto.createHash('md5').update(string, 'utf-8').digest("hex")

s3Primitive = (SDK) ->
  (configuration) ->
    s3 = applyConfiguration configuration, SDK.S3

    bucketExists = (name) ->
      try
        await s3.headBucket Bucket: name
        true
      catch e
        notFound e

    exists = curry (name, key) ->
      try
        await s3.headObject {Bucket: name, Key: key}
        true
      catch e
        notFound e

    bucketTouch = (name) ->
      return true if await bucketExists name
      await s3.createBucket {Bucket: name}
      await sleep 15000 # race condition with S3 API.  Wait to be available.

    put = curry (Bucket, Key, data, filetype) ->
      if filetype
        # here, data is stringified data.
        content = body = Buffer.from data
      else
        # here, data is a path to file.
        filetype = mime.getType data
        body = createReadStream data
        content =
          if "text" in mime.getType(data)
            await read data
          else
            await read data, "buffer"

      await s3.putObject {
        Bucket, Key,
        ContentType: filetype
        ContentMD5: Buffer.from(md5(content), "hex").toString('base64')
        Body: body
      }

    get = curry (name, key, encoding="utf8") ->
      try
        {Body} = await s3.getObject {Bucket: name, Key: key}
        if encoding == "binary"
          Body
        else
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

    bucketPutACL = (parameters) ->
      await s3.putBucketAcl parameters

    #####
    # Multipart upload functions
    #####
    multipartStart = (Bucket, Key, ContentType, options={}) ->
      await s3.createMultipartUpload merge {Bucket, Key, ContentType}, options

    multipartAbort = (Bucket, Key, UploadId) ->
      await s3.abortMultipartUpload {Bucket, Key, UploadId}

    multipartComplete = (Bucket, Key, UploadId, MultipartUpload) ->
      await s3.completeMultipartUpload {Bucket, Key, UploadId, MultipartUpload}

    multipartPut = (Bucket, Key, UploadId, PartNumber, part, filetype) ->
      if filetype
        # here, data is stringified data.
        content = body = Buffer.from part
      else
        # here, data is a path to file.
        filetype = mime.getType part
        body = createReadStream part
        content =
          if "text" in filetype
            await read part
          else
            await read part, "buffer"

      await s3.uploadPart {
        Bucket, Key, UploadId, PartNumber,
        ContentType: filetype
        ContentMD5: Buffer.from(md5(content), "hex").toString('base64')
        Body: body
      }


    # Signing a URL grants the bearer the ability to perform the given action against an S3 object, even if they are not you.
    sign = (action, parameters) ->
      await s3.getSignedUrl action, parameters

    signPost = (parameters) ->
      await s3.createPresignedPost parameters


    {bucketExists, exists, bucketTouch, put, get, del, bucketDel, list, bucketEmpty, multipartStart, multipartAbort, multipartPut, multipartComplete, sign, signPost}


export default s3Primitive
