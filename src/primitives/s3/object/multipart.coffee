import {merge, isString, isBuffer} from "panda-parchment"
import {read} from "panda-quill"
import Method from "panda-generics"
import mime from "mime"
import {md5} from "../helpers"


Section = (s3) ->
  multipartStart = (Bucket, Key, ContentType, options={}) ->
    await s3.createMultipartUpload merge {Bucket, Key, ContentType}, options

  multipartAbort = (Bucket, Key, UploadId) ->
    await s3.abortMultipartUpload {Bucket, Key, UploadId}

  multipartComplete = (Bucket, Key, UploadId, MultipartUpload) ->
    await s3.completeMultipartUpload {Bucket, Key, UploadId, MultipartUpload}

  multipartPut = Method.create
    name: "multipartPut"
    description: "uploads a part within an S3 multipart upload flow"
    default: (args...) ->
      throw new Error "sundog:s3:multipartPut -
        no match on #{JSON.stringify args}"

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
      (await read path, "buffer"), (mime.getType path)

  # Putting a file on disk to S3, with type override
  Method.define multipartPut, isString, isString, isString, isString, isString
  (Bucket, Key, UploadId, PartNumber, path) ->
    multipartPut Bucket, Key, UploadId, PartNumber,
      (await read file.path, "buffer"), file.type

  {multipartStart, multipartAbort, multipartComplete, multipartPut}

export default Section
