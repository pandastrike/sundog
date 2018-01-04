# Primitives for the service DynamoDB.
# The main entities are Tables and Items.
# This follows the naming convention that methods that work on Tables will be
# prefixed "table*", whereas item methods will have no prefix.

import {merge, sleep, empty, cat, collect, project, pick, curry, difference, first, keys, values, Method, isFunction, isObject} from "fairmont"
import {notFound} from "./utils"

DynamoDB = (_AWS) ->
  {DynamoDB: db} = _AWS

  #===========================================================================
  # Tables
  #===========================================================================
  tableGet = (name) ->
    try
      {Table} = await db.describeTable TableName: name
      Table
    catch e
      notFound e, 400, "ResourceNotFoundException"

  tableCreate = (name, keys, attributes, throughput, options={}) ->
    p =
      TableName: name
      KeySchema: keys
      AttributeDefinitions: attributes
      ProvisionedThroughput: throughput

    {TableDescription}= await db.createTable merge p, options
    TableDescription

  tableUpdate = (name, attributes, throughput, options={}) ->
    p =
      TableName: name
      AttributeDefinitions: attributes
    p.ProvisionedThroughput = throughput if throughput

    {TableDescription}= await db.updateTable merge p, options
    TableDescription

  tableDel = (name) ->
    try
      await db.deleteTable TableName: name
    catch e
      notFound e


  _isTableReady = (name) ->
    while true
      {TableStatus} = await tableGet name
      if !TableStatus
        throw new Error "Cannot find table #{name}"
      else if TableStatus != "ACTIVE"
        await sleep 5000
      else
        return true

  _areIndexesReady = (name) ->
    while true
      {GlobalSecondaryIndexes: indexes} = await tableGet name
      return true if !indexes
      statuses = collect project "IndexStatus", indexes
      if empty difference statuses, ["ACTIVE"]
        return true
      else
        await sleep 5000

  # The optional second parameter allows the developer to also wait on all global secondary indexes to also be ready.
  tableWaitForReady = (name, indexWait) ->
    checks = [_isTableReady name]
    checks.push _areIndexesReady name if indexWait
    await Promise.all checks

  tableWaitForDeleted = (name) ->
    while true
      {TableStatus} = await tableGet name
      if !TableStatus
        return true
      else
        await sleep 5000

  # TODO: make this more efficient by throttling to X connections at once. AWS
  # only supports N requests per second from an account, and I don't want this
  # to violate that limit, but we can do better than one at a time.
  _passPrimaryKeys = curry (keys, item) ->
    f = (key) -> key in keys
    pick f, item

  tableEmpty = (name) ->
    {KeySchema} = await tableGet name
    keys = collect project "AttributeName", KeySchema
    onlyKeys = _passPrimaryKeys keys

    {Items} = await scan name
    await del name, onlyKeys(i) for i in Items

  #===========================================================================
  # Type Helpers
  #===========================================================================
  # DynamoDB includes type information mapped into its data strctures.
  # It expects data to be input that way, and includes it when fetched.
  # These helpers write and parse that type system.
  _transform = (f) ->
    (x) ->
      if isObject x
        out = {}
        out[k] = _mark("anyonymousDynamodbValue", f v) for k, v of x
        _mark "namedDynamodbValue", out
      else
        _mark "anyonymousDynamodbValue", f x

  _mark = (name, object) -> Object.defineProperty object, "name", value: name

  to =
    S: _transform (s) -> S: s.toString()
    N: _transform (n) -> N: n.toString()
    B: _transform (b) -> B: b.toString("base64")
    SS: _transform (a) -> SS: (i.toString() for i in a)
    NS: _transform (a) -> NS: (i.toString() for i in a)
    BS: _transform (a) -> BS: (i.toString("base64") for i in a)
    M: _transform (m) -> M: m
    L: _transform (l) -> L: l
    Null: _transform (n) -> NULL: n
    Bool: _transform (b) -> BOOL: b

  parse = (attributes) ->
    result = {}
    for name, typeObj of attributes
      dataType = first keys typeObj
      v = first values typeObj
      result[name] = switch dataType
        when "S", "SS", "L", "BOOL" then v
        when "N" then new Number v
        when "B" then Buffer.from v, "base64"
        when "NS" then (new Number i for i in v)
        when "BS" then (Buffer.from i, "base64" for i in v)
        when "NULL"
          if v then null else undefined
        when "M" then parse v
        else
          throw new Error "Unable to parse object for DynamoDB attribute type. #{dataType}"
    result


  #===========================================================================
  # Items
  #===========================================================================
  get = (name, key, options={}) ->
    {ReturnConsumedCapacity} = options
    p = {TableName: name, Key: key}
    {Item, ConsumedCapacity} = await db.getItem merge p, options
    if ReturnConsumedCapacity then {Item, ConsumedCapacity} else Item

  put = (name, item, options={}) ->
    p = {TableName: name, Item: item}
    await db.putItem merge p, options

  update = (name, key, data, options={}) ->
    p = {TableName: name, Key: key, UpdateExpression: data}
    await db.putItem merge p, options

  del = (name, key, options={}) ->
    p = {TableName: name, Key: key}
    await db.deleteItem merge p, options

  #===========================================================================
  # Queries and Scans against Tables and Indexes
  #===========================================================================
  _delimiter = "<###SUNDOGDYNAMODB###>"
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

  _parseConditional = (ex, count=0) ->
    return {result:false, values:false, count} if !ex
    Values = {}
    re = new RegExp "#{_delimiter}.+?#{_delimiter}", "g"

    result = ex.replace re, (match) ->
      [, obj] = match.split _delimiter
      placeholder = ":param#{count}"
      count++
      Values[placeholder] = JSON.parse obj
      placeholder # Return placeholder to the expression we are processing.

    {result, values:Values, count}

  _parseQuery = (options, name, keyEx, filterEx) ->
    {tableName, indexName} = _parseName name
    {result:key, values:keyValues, count} = _parseConditional keyEx
    {result:filter, values:filterValues} = _parseConditional filterEx, count

    out = options
    out.TableName = tableName
    out.IndexName = indexName if indexName
    out.KeyConditionExpression = key if key
    out.FilterExpression = filter if filter
    if keyValues || filterValues
      out.ExpressionAttributeValues =
        merge (keyValues || {}), (filterValues || {})
    out

  # qv produces query strings with delimited values SunDog can parse.
  _qv = (o) ->
    delimit = (s) -> "#{_delimiter}#{s}#{_delimiter}"
    # Determine if this is a DynamoDB value, and whether is anyonymous or named.
    if o.name == "anyonymousDynamodbValue"
      delimit JSON.stringify o
    else if o.name == "namedDynamodbValue"
      delimit JSON.stringify first values o
    else
      throw new Error "Unable to create stringified query value for unrecongied object #{JSON.stringify o}"

  qv = Method.create()
  Method.define qv, isFunction, (f) -> (x) -> _qv f x
  Method.define qv, isObject, (o) -> _qv o

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



  {tableGet, tableCreate, tableUpdate, tableDel, tableWaitForReady, tableWaitForDeleted, tableEmpty, to, parse, merge, get, put, update, del, qv, query, scan}

export default DynamoDB
