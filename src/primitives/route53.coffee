import {cat, empty} from "panda-parchment"
import {collect} from "panda-river"
import {where} from "./private-utils"
import {root, fullyQualify} from "../helpers/url"
import {prepareModule} from "../lift"

route53Primitive = (options) ->
  (configuration) ->
    route53 = prepareModule options, configuration,
      require("aws-sdk/clients/route53"),
      [
        "listHostedZones"
        "listResourceRecordSets"
      ]

    hzList = (current=[], marker) ->
      params = MaxItems: "100"
      params.Marker = marker if marker
      data = await route53.listHostedZones params
      current = cat current, data.HostedZones
      if data.IsTruncated
        await _listHZ current, data.Marker
      else
        current

    recordList = (id, current=[], marker) ->
      params =
        HostedZoneId: id
        MaxItems: "100"
      params.StartRecordName = marker if marker
      data = await route53.listResourceRecordSets params
      current = cat current, data.ResourceRecordSets
      if data.IsTruncated
        await _listRecords id, current, data.NextRecordName
      else
        current

    hzGet = (name) ->
      zone = root name
      zones = await hzList()
      result = collect where {Name: zone}, zones
      if empty result then false else result[0].Id

    recordGet = (name) ->
      records = await _listRecords await _getHostedZoneID name
      result = collect where {Name: fullyQualify name}, records
      if empty result then false else result[0]



    {hzList, recordList, hzGet, recordGet}

export default route53Primitive
