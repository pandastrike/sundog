# Primitives for the service DynamoDB.
# The main entities are Tables and Items.
# This follows the naming convention that methods that work on Tables will be
# prefixed "table*", whereas item methods will have no prefix.

import {merge, sleep, empty, cat, collect, project, pick, curry, difference} from "fairmont"
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
      notFound e, 400

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
    try
      {ReturnConsumedCapacity} = options
      p = {TableName: name, Key: key}
      {Item, ConsumedCapacity} = await db.getItem merge p, options
      if ReturnConsumedCapacity then {Item, ConsumedCapacity} else Item
    catch e
      notFound e

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

  {tableGet, tableCreate, tableUpdate, tableDel, tableWaitForReady, tableWaitForDeleted, tableEmpty, get, put, update, del, query, scan}

export default DynamoDB
