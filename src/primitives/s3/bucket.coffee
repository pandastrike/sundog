# Primitives for the service S3.  The main entities are buckets and objects.
# This follows the naming convention that methods that work on buckets will be
# prefixed "bucket*", whereas object methods will have no prefix.

import {sleep, merge, isArray} from "panda-parchment"
import {collect, project, partition} from "panda-river"
import {notFound} from "../private-utils"

Section = (s3, fns) ->
  bucketHead = bucketExists = (name) ->
    try
      await s3.headBucket Bucket: name
    catch e
      notFound e

  bucketTouch = (name) ->
    return true if await bucketExists name
    await s3.createBucket {Bucket: name}
    await sleep 20000 # race condition with S3 API.  Wait to be available.

  bucketCreate = (name, options={}) ->
    await s3.create merge {Bucket: name}, options

  # Sets the access control permissions on the whole bucket.
  bucketSetACL = (name, value) ->
    await s3.putBucketAcl {Bucket: name, ACL: value}

  buildCORSRule = ({
      allowedHeaders = ["*"],
      allowedMethods = ["GET"],
      allowedOrigins = ["*"],
      exposedHeaders = [""],
      maxAge
  }) ->
    AllowedHeaders: allowedHeaders
    AllowedMethods: allowedMethods
    AllowedOrigins: allowedOrigins
    ExposeHeaders: exposedHeaders
    MaxAgeSeconds: maxAge

  # Set Cross Origin Resource Sharing (CORS) configuration for the whole bucket.
  bucketSetCORS = (name, config) ->
    if isArray config
      rules = (buildCORSRule c for c in config)
    else
      rules = [ buildCORSRule config ]

    await s3.putBucketCors
      Bucket: name,
      CORSConfiguration: {CORSRules: rules}
      ContentMD5: ""

  bucketSetWebsite = (name, site, redirect) ->
    params = Bucket: name
    if site
      params.WebsiteConfiguration = {}
      if site.index?
        params.WebsiteConfiguration.IndexDocument = Suffix: site.index
      if site.error?
        params.WebsiteConfiguration.ErrorDocument = Key: site.error
    if redirect
      params.RedirectAllRequestsTo =
        HostName: redirect.host
        Protocol: redirect.protocol ? "https"

    await s3.putBucketWebsite params


  bucketDelete = (name) ->
    try
      await s3.deleteBucket Bucket: name
    catch e
      notFound e


  # TODO: make this more efficient by throttling to X connections at once. AWS
  # only supports N requests per second from an account, and I don't want this
  # to violate that limit, but we can do better than one at a time.
  bucketEmpty = (name) ->
    items = await fns.list name
    keys = collect project "Key", items
    await fns.deleteBatch name, batch for batch from partition 1000, keys



  {bucketExists, bucketHead, bucketTouch, bucketCreate, bucketSetACL, bucketSetCORS, bucketSetWebsite, bucketDelete, bucketEmpty}

export default Section