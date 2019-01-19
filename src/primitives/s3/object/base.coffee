import {cat} from "panda-parchment"
import {notFound} from "../../private-utils"


Section = (s3) ->
  head = exists = (name, key) ->
    try
      await s3.headObject {Bucket: name, Key: key}
    catch e
      notFound e

  get = (name, key, encoding="utf8") ->
    try
      {Body} = await s3.getObject {Bucket: name, Key: key}
      if encoding == "binary"
        Body
      else
        Body.toString encoding
    catch e
      notFound e

  destroy = (name, key) ->
    try
      await s3.deleteObject {Bucket: name, Key: key}
    catch e
      notFound e

  deleteBatch = (name, keys) ->
    console.log "deleteBatch", {name, keys}
    await s3.deleteObjects
      Bucket: name
      Delete:
        Objects: (Key: key for key in keys)
        Quiet: true

  list = (name, items=[], marker) ->
    p = {Bucket: name, MaxKeys: 1000}
    p.ContinuationToken = marker if marker

    {IsTruncated, Contents, NextContinuationToken} = await s3.listObjectsV2 p
    if IsTruncated
      items = cat items, Contents
      await list name, items, NextContinuationToken
    else
      cat items, Contents

  {head, exists, get, delete: destroy, deleteBatch, list}

export default Section
