#===========================================================================
# Queries and Scans against Tables and Indexes
#===========================================================================
import {cat, merge, first, values} from "panda-parchment"
import {parseConditional} from "./helpers/expressions"

_setupCurrent = ->
  Items: []
  Count: 0
  ScannedCount: 0
  LastEvaluatedKey: false
  ConsumedCapacity: []

_catCurrent = (current, results) ->
  {Items, Count, ScannedCount, LastEvaluatedKey, ConsumedCapacity} = results
  current.Items = cat current.Items, Items
  current.Count += Count
  current.ScannedCount += ScannedCount
  current.LastEvaluatedKey = LastEvaluatedKey if LastEvaluatedKey
  current.ConsumedCapacity = current.ConsumedCapacity.push ConsumedCapacity
  current

_parseName = (name) ->
  throw new Error "Must provide table name." if !name
  parts = name.split ":"
  if parts.length > 1
    {tableName: parts[0], indexName: parts[1]}
  else
    {tableName: name, indexName: false}

_parseQuery = (options, name, keyEx, filterEx) ->
  {tableName, indexName} = _parseName name
  {result:key, values:keyValues, count} = parseConditional keyEx
  {result:filter, values:filterValues} = parseConditional filterEx, count

  out = options
  out.TableName = tableName
  out.IndexName = indexName if indexName
  out.KeyConditionExpression = key if key
  out.FilterExpression = filter if filter
  if keyValues || filterValues
    out.ExpressionAttributeValues =
      merge (keyValues || {}), (filterValues || {})
  out


DynamoDB = (db) ->
  query = (name, keyEx, filterEx, options={}, current) ->
    current = _setupCurrent() if !current
    if !current.options
      current.options = options = _parseQuery options, name, keyEx, filterEx
    else
      {options} = current

    p = {}
    p.ExclusiveStartKey = current.LastEvaluatedKey if current.LastEvaluatedKey
    results = await db.query merge p, options

    current = _catCurrent current, results
    if !results.LastEvaluatedKey || options.Limit
      current
    else
      await query name, keyEx, filterEx, options, current

  scan = (name, filterEx, options={}, current) ->
    current = _setupCurrent() if !current
    if !current.options
      current.options = options = _parseQuery options, name, false, filterEx
    else
      {options} = current

    p = {}
    p.ExclusiveStartKey = current.LastEvaluatedKey if current.LastEvaluatedKey
    results = await db.scan merge p, options

    current = _catCurrent current, results
    if !results.LastEvaluatedKey || options.Limit
      current
    else
      await scan name, filterEx, options, current

  {query, scan}

export default DynamoDB
