import {flow} from "panda-garden"
import {cat} from "panda-parchment"
import {collect, project, partition} from "panda-river"
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

  rm = (name, key) ->
    try
      await s3.deleteObject {Bucket: name, Key: key}
    catch e
      notFound e

  rmBatch = (name, keys) ->
    await s3.deleteObjects
      Bucket: name
      Delete:
        Objects: (Key: key for key in keys)
        Quiet: true

  list = (name, prefix, items=[], marker) ->
    p = Bucket: name, MaxKeys: 1000
    p.ContinuationToken = marker if marker
    p.Prefix = prefix if prefix

    {IsTruncated, Contents, NextContinuationToken} = await s3.listObjectsV2 p
    if IsTruncated
      items = cat items, Contents
      await list name, prefix, items, NextContinuationToken
    else
      cat items, Contents

  rmDir = (name, prefix) ->
    keys = collect project "Key", await list name, prefix
    await rmBatch name, batch for batch from partition 1000, keys

  {head, exists, get, rm, rmBatch, list, rmDir}

export default Section
