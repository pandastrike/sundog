import {cat, empty, sleep, merge} from "panda-parchment"
import {collect} from "panda-river"
import {where} from "./private-utils"
import {root, regularlyQualify} from "../helpers/url"
import KMS from "./kms"
import {applyConfiguration} from "../lift"

cloudfrontPrimitive = (SDK) ->
  (configuration) ->
    cfr = applyConfiguration configuration, SDK.CloudFront
    {randomBytes} = (KMS SDK) configuration

    list = (current=[], marker) ->
      params = MaxItems: "100"
      params.Marker = marker if marker
      data = await cfr.listDistributions params
      current = cat current, data.DistributionList.Items
      if data.IsTruncated
        await list current, data.DistributionList.Marker
      else
        current

    hoistETag = (data) ->
      {Distribution} = data
      merge Distribution, {ETag: data.ETag}

    get = (name) ->
      list = await list()
      pattern =
        Aliases:
          Quantity: 1,
          Items: [ regularlyQualify name ]

      matches = collect where pattern, list
      if empty matches
        false
      else
        hoistETag await cfr.getDistribution Id: matches[0].Id

    issueInvalidation = ({Id}, paths) ->
      paths ?= ["/*"]
      params =
        DistributionId: Id
        InvalidationBatch:
          CallerReference: "Sky" + (await randomBytes 16).toString()
          Paths: {Quantity: paths.length, Items: paths}

      {Invalidation} = await cfr.createInvalidation params
      Invalidation

    invalidate = (distribution, paths) ->
      {Id} = await issueInvalidation distribution, paths
      params = {DistributionId: distribution.Id, Id}

      while true
        {Invalidation: {Status}} = await cfr.getInvalidation params
        if Status == "Completed" then return else await sleep 15000


    {list, get, issueInvalidation, invalidate}

export default cloudfrontPrimitive
