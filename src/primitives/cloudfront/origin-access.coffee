import {cat, isEmpty} from "panda-parchment"
import {collect} from "panda-river"
import {where} from "../private-utils"

handler = (cf) ->

  list = (current=[], marker) ->
    params = Marker: marker if marker
    data = await cf.listCloudFrontOriginAccessIdentities params
    {Items, IsTruncated, NextMarker} = data.CloudFrontOriginAccessIdentityList

    current = cat current, Items
    if IsTruncated
      await list current, NextMarker
    else
      current

  get = (name) ->
    matches = collect where Comment: name, await list()
    if isEmpty matches
      false
    else
      matches[0]


  create = (name) ->
    await cf.createCloudFrontOriginAccessIdentity
      CloudFrontOriginAccessIdentityConfig:
        CallerReference: new Date().toISOString()
        Comment: name

  destroy = (name) ->
    return unless (match = await get name)
    {ETag} = await cf.getCloudFrontOriginAccessIdentity Id: match.Id
    await cf.deleteCloudFrontOriginAccessIdentity
      Id: match.Id
      IfMatch: ETag



  originAccess: {list, get, create, delete: destroy}

export default handler
