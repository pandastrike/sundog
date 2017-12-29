# Primitives for the service DynamoDB.
# The main entities are Tables and Items.
# This follows the naming convention that methods that work on Tables will be
# prefixed "table*", whereas item methods will have no prefix.

import {merge, sleep, empty, cat, collect, project, pick, curry, difference, isObject, first, keys, values} from "fairmont"
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


  query = (name, keyEx, filterEx, options={}, current) ->
    current = _setupCurrent() if !current

    p = {TableName: name}
    p.KeyConditionExpression = keyEx if keyEx
    p.FilterExpression = filterEx if filterEx
    p.ExclusiveStartKey = current.LastEvaluatedKey if current.LastEvaluatedKey
    results = await db.query merge p, options

    current = _catCurrent current, results
    if !results.LastEvaluatedKey || options.Limit
      current
    else
      await query name, keyEx, filterEx, options, current

  scan = (name, filterEx, options={}, current) ->
    current = _setupCurrent() if !current

    p = {TableName: name}
    p.FilterExpression = filterEx if filterEx
    p.ExclusiveStartKey = current.LastEvaluatedKey if current.LastEvaluatedKey
    results = await db.scan merge p, options

    current = _catCurrent current, results
    if !results.LastEvaluatedKey || options.Limit
      current
    else
      await scan name, filterEx, options, current

  #===========================================================================
  # Type Helpers
  #===========================================================================
  # DynamoDB locks its data within a type system and expects data to be input
  # that way.  These helpers write and parse that type system.
  _transform = (x, f) ->
    out = {}
    if isObject x
      out[k] = f v for k, v of x
      out
    else
      f x

  toS = (x) ->
    f = (s) -> S: s.toString()
    _transform x, f

  toN = (x) ->
    f = (n) -> N: n.toString()
    _transform x, f

  toB = (x) ->
    f = (b) -> B: b.toString("base64")
    _transform x, f

  toSS = (x) ->
    f = (a) -> SS: (i.toString() for i in a)
    _transform x, f

  toNS = (x) ->
    f = (a) -> NS: (i.toString() for i in a)
    _transform x, f

  toBS = (x) ->
    f = (a) -> BS: (i.toString("base64") for i in a)
    _transform x, f

  toM = (x) ->
    f = (m) -> M: m
    _transform x, f

  toL = (x) ->
    f = (l) -> L: l
    _transform x, f

  toNull = (x) ->
    f = (n) -> NULL: n
    _transform x, f

  toBool = (x) ->
    f = (b) -> BOOL: b
    _transform x, f

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
        when "NULL" then !v
        when "M" then parse v
        else
          throw new Error "Unable to parse object for DynamoDB attribute type. #{dataType}"
    result

  {tableGet, tableCreate, tableUpdate, tableDel, tableWaitForReady, tableWaitForDeleted, tableEmpty, get, put, update, del, query, scan, toS, toN, toB, toSS, toNS, toBS, toM, toL, toNull, toBool, parse, merge}

export default DynamoDB
