# Primitives for the service S3.  The main entities are buckets and objects.
# This follows the naming convention that methods that work on buckets will be
# prefixed "bucket*", whereas object methods will have no prefix.

import {createReadStream} from "fs"
import Crypto from "crypto"
import {sleep, cat, merge, isString, isBuffer, isObject} from "panda-parchment"
import {read} from "panda-quill"
import {Method} from "panda-generics"
import mime from "mime"

import {notFound} from "./utils"
import {applyConfiguration} from "../lift"

md5 = (buffer) ->
  Crypto.createHash('md5').update(buffer).digest("base64")

s3Primitive = (SDK) ->
  (configuration) ->
    s3 = applyConfiguration configuration, SDK.S3

    bucketHead = bucketExists = (name) ->
      try
        await s3.headBucket Bucket: name
      catch e
        notFound e

    head = exists = (name, key) ->
      try
        await s3.headObject {Bucket: name, Key: key}
      catch e
        notFound e

    bucketTouch = (name) ->
      return true if await bucketExists name
      await s3.createBucket {Bucket: name}
      await sleep 15000 # race condition with S3 API.  Wait to be available.

    put = Method.create default: (args...) ->
      console.error "sundog:s3:put, unable to match to method on", args
      throw new Error()
    # Putting a buffer of raw data to S3
    Method.define put, isString, isString, isBuffer, isString,
    (Bucket, Key, buffer, type) ->
      await s3.putObject {
        Bucket, Key,
        ContentType: type
        ContentMD5: md5 buffer
        Body: buffer
      }
    # Putting a string to S3
    Method.define put, isString, isString, isString, isString,
    (Bucket, Key, text, type) ->
      put Bucket, Key, Buffer.from(text, type), type

    # Putting a file on disk to S3
    Method.define put, isString, isString, isString,
    (Bucket, Key, path) ->
      put Bucket, Key, (read path, "buffer"), (mime.getType path)

    # Putting a file on disk to S3, with type override
    Method.define put, isString, isString, isObject,
    (Bucket, Key, file) ->
      put Bucket, Key, (read file.path, "buffer"), file.type


    get = (name, key, encoding="utf8") ->
      try
        {Body} = await s3.getObject {Bucket: name, Key: key}
        if encoding == "binary"
          Body
        else
          Body.toString encoding
      catch e
        notFound e

    del = (name, key) ->
      try
        await s3.deleteObject {Bucket: name, Key: key}
      catch e
        notFound e

    bucketDel = (name) ->
      try
        await s3.deleteBucket Bucket: name
      catch e
        notFound e

    list = (name, items=[], marker) ->
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

    multipartPut = Method.create default: (args...) ->
      console.error "sundog:s3:multipartPut, unable to match method on", args
      throw new Error()
    # Putting a buffer of raw data to S3
    Method.define multipartPut, isString, isString, isString, isString, isBuffer, isString,
    (Bucket, Key, UploadId, PartNumber, buffer, type) ->
      await s3.uploadPart {
        Bucket, Key, UploadId, PartNumber,
        ContentType: type
        ContentMD5: md5 buffer
        Body: buffer
      }
    # Putting a string to S3
    Method.define multipartPut, isString, isString, isString, isString, isString, isString,
    (Bucket, Key, UploadId, PartNumber, text, type) ->
      multipartPut Bucket, Key, UploadId, PartNumber,
        Buffer.from(text, type), type

    # Putting a file on disk to S3
    Method.define multipartPut, isString, isString, isString, isString, isString
    (Bucket, Key, UploadId, PartNumber, path) ->
      multipartPut Bucket, Key, UploadId, PartNumber,
        (read path, "buffer"), (mime.getType path)

    # Putting a file on disk to S3, with type override
    Method.define multipartPut, isString, isString, isString, isString, isString
    (Bucket, Key, UploadId, PartNumber, path) ->
      multipartPut Bucket, Key, UploadId, PartNumber,
        (read file.path, "buffer"), file.type

    # Signing a URL grants the bearer the ability to perform the given action against an S3 object, even if they are not you.
    sign = (action, parameters) ->
      await s3.getSignedUrl action, parameters

    signPost = (parameters) ->
      await s3.createPresignedPost parameters


    {bucketExists, bucketHead, exists, head, bucketTouch, put, get, del, bucketDel, list, bucketEmpty, multipartStart, multipartAbort, multipartPut, multipartComplete, sign, signPost}


export default s3Primitive
