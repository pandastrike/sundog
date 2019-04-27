#===========================================================================
# Queries and Scans against Tables and Indexes
#===========================================================================
import {cat, merge, first, values} from "panda-parchment"
import {parseConditional} from "./helpers/expressions"

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

  options.TableName = tableName
  options.IndexName = indexName if indexName
  options.KeyConditionExpression = key if key
  options.FilterExpression = filter if filter
  if keyValues || filterValues
    options.ExpressionAttributeValues =
      merge (keyValues || {}), (filterValues || {})
  options


DynamoDB = (db) ->
  query = (name, keyEx, filterEx, options={}) ->
    # _parseQuery augments any input options with request parameters
    options = _parseQuery options, name, keyEx, filterEx
    await db.query options

  scan = (name, filterEx, options={}) ->
    options = _parseQuery options, name, false, filterEx
    await db.scan options

  {query, scan}

export default DynamoDB
