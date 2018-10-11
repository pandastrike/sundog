import {cat, collect, where, empty, sleep, merge} from "panda-parchment"
import {root, regularlyQualify} from "./url"
import KMS from "./kms"
import {applyConfiguration} from "../lift"

cloudfrontPrimitive = (SDK) ->
  (configuration) ->
    cfr = applyConfiguration configuration, SDK.CloudFront
    {randomKey} = KMS _AWS

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

    invalidate = ({Id}) ->
      params =
        DistributionId: Id
        InvalidationBatch:
          CallerReference: "Sky" + await randomKey 16
          Paths: {Quantity: 1, Items: ["/*"]}

      {Invalidation} = await cfr.createInvalidation params
      params = {DistributionId: Id, Id: Invalidation.Id}

      while true
        {Invalidation: {Status}} = await cfr.getInvalidation params
        if Status == "Completed" then return else await sleep 15000



    {list, get, invalidate}

export default cloudfrontPrimitive
