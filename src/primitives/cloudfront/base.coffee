import {cat, isEmpty, sleep, merge} from "panda-parchment"
import {collect} from "panda-river"
import {where} from "../private-utils"
import {root, regularlyQualify} from "../../helpers/url"

handler = (cf) ->

  list = (current=[], marker) ->
    params = MaxItems: "100"
    params.Marker = marker if marker
    data = await cf.listDistributions params
    {Items, IsTruncated, NextMarker} = data.DistributionList

    current = cat current, Items
    if IsTruncated
      await list current, NextMarker
    else
      current

  hoistETag = (data) ->
    {Distribution} = data
    merge Distribution, {ETag: data.ETag}

  get = (name) ->
    distributions = await list()
    pattern =
      Aliases:
        Quantity: 1,
        Items: [ regularlyQualify name ]

    matches = collect where pattern, distributions
    if isEmpty matches
      false
    else
      hoistETag await cf.getDistribution Id: matches[0].Id

  issueInvalidation = ({Id}, paths) ->
    paths ?= ["/*"]
    params =
      DistributionId: Id
      InvalidationBatch:
        CallerReference: new Date().toISOString()
        Paths: {Quantity: paths.length, Items: paths}

    {Invalidation} = await cf.createInvalidation params
    Invalidation

  invalidate = (distribution, paths) ->
    {Id} = await issueInvalidation distribution, paths
    params = {DistributionId: distribution.Id, Id}

    while true
      {Invalidation: {Status}} = await cf.getInvalidation params
      if Status == "Completed" then return else await sleep 15000


  {list, get, issueInvalidation, invalidate}

export default handler
