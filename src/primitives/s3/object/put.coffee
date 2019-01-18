# Put would seem like a simple enough function, but there are lots of ways to
# use it.  This design is an attempt to control the combinatorics
# on the s3 object put feature.

import mime from "mime"
import {merge} from "panda-parchment"
import {read} from "panda-quill"

import {md5} from "../helpers"

Section = (s3) ->

  put = (Bucket, Key, options) ->
    await s3.putObject merge {Bucket, Key}, options

  PUT =
    string: (bucket, key, text, options={}) ->
      Body = Buffer.from text
      ContentMD5 = md5 Body
      put bucket, key, merge {Body, ContentMD5}, options

    file: (bucket, key, path, options={}) ->
      ContentType = options.ContentType ? mime.getType path

      Body =
        if /^text\//.test ContentType
          Buffer.from await read path
        else
          await read path, "buffer"

      ContentMD5 = md5 Body

      put bucket, key, merge {Body, ContentType, ContentMD5}, options

    buffer: (bucket, key, buffer, options={}) ->
      put bucket, key, merge {Body}, options


  {PUT, put}

export default Section
