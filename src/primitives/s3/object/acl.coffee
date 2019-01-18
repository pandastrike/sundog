import {Method} from "panda-generics"
import {merge, isString, isObject} from "panda-parchment"

Section = (s3, fns) ->
  putACL = Method.create default: (args...) ->
    throw new Error "sundog:s3:putACL -
      no match on #{JSON.stringify args}"

  # Putting a buffer of raw data to S3
  Method.define putACL, isString, isString, isString, isObject,
    (Bucket, Key, ACL, options) ->
      await s3.putObject merge {Bucket, Key, ACL}, options

  Method.define putACL, isString, isString, isString,
    (Bucket, Key, ACL) -> putACL Bucket, Key, ACL, {}

  Method.define putACL, isString, isString, isObject,
    (Bucket, Key, options) -> putACL Bucket, Key, "", options

  {putACL}

export default Section
