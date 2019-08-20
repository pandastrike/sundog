# Put would seem like a simple enough function, but there are lots of ways to
# use it.  This design is an attempt to control the combinatorics
# on the s3 object put feature.

import mime from "mime"
import ProgressBar from "progress"
import {merge} from "panda-parchment"

import {md5, read} from "../helpers"

Section = (s3) ->

  put = (Bucket, Key, options) ->
    await s3.putObject merge {Bucket, Key}, options

  upload = (Bucket, Key, options) ->
    new Promise (resolve, reject) ->
      current = 0
      bar = new ProgressBar "uploaded :size MB [:bar] :percent ",
        total: options.Body.length
        complete: "="
        incomplete: " "
        width: 20

      s3.upload merge {Bucket, Key}, options
      .on "httpUploadProgress", ({loaded}) ->
        bar.tick (loaded - current),
          size: (loaded / 1e6).toFixed 3
        current = loaded
      .send (error, result) -> if error? then reject error else resolve result


  PUT =
    string: (bucket, key, text, options={}) ->
      Body = Buffer.from text
      ContentMD5 = md5 Body
      put bucket, key, merge {Body, ContentMD5}, options

    file: (bucket, key, path, options={}) ->
      ContentType = options.ContentType ? mime.getType path
      Body = await read path
      ContentMD5 = md5 Body

      put bucket, key, merge {Body, ContentType, ContentMD5}, options

    fileWithProgress: (bucket, key, path, options={}) ->
      ContentType = options.ContentType ? mime.getType path
      Body = await read path

      upload bucket, key, merge {Body, ContentType}, options

    buffer: (bucket, key, Body, options={}) ->
      ContentMD5 = md5 Body
      put bucket, key, merge {Body, ContentMD5}, options


  {PUT, put}

export default Section
