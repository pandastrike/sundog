# Primitives for the service DynamoDB.
# The main entities are Tables and Items.
# This follows the naming convention that methods that work on Tables will be
# prefixed "table*", whereas item methods will have no prefix.

import {curry, merge, sleep, empty, cat} from "fairmont"
import {notFound} from "./utils"

DynamoDB = (_AWS) ->
  {DynamoDB: db} = _AWS

  #===========================================================================
  # Tables
  #===========================================================================
  tableGet = (name) ->
    try
      {TableDescription} = await db.describeTable TableName: name
      TableDescription
    catch e
      notFound e

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
      ProvisionedThroughput: throughput

    {TableDescription}= await db.updateTable merge p, options
    TableDescription

  tableDel = (name) ->
    try
      await db.deleteTable TableName: name
    catch e
      notFound e

  tableWaitForReady = (name) ->
    while true
      {TableStatus} = await tableGet name
      if !TableStatus
        throw new Error "Cannot find table #{name}"
      else if TableStatus != "ACTIVE"
        await sleep 5000
      else
        return true

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
  tableEmpty = (name) ->
    items = await query name
    await del name, i for i in items

  #===========================================================================
  # Items
  #===========================================================================
  get = curry (name, key, options={}) ->
    try
      {ReturnConsumedCapacity} = options
      p = {TableName: name, Key: key}
      {Item, ConsumedCapacity} = await db.getItem merge p, options
      if ReturnConsumedCapacity then {Item, ConsumedCapacity} else Item
    catch e
      notFound e

  put = curry (name, item, options={}) ->
    p = {TableName: name, Item: item}
    await db.putItem merge p, options

  update = curry (name, key, data, options={}) ->
    p = {TableName: name, Key: key, UpdateExpression: data}
    await db.putItem merge p, options

  del = curry (name, key, options={}) ->
    p = {TableName: name, Key: key}
    await db.deleteItem merge p, options


  _setupCurrent = ->
    Items: []
    Count: 0
    ScannedCount: 0
    LastEvaluatedKey: {}
    ConsumedCapacity: []

  _catCurrent = (current, results) ->
    {Items, Count, ScannedCount, LastEvaluatedKey, ConsumedCapacity} = results
    current.Items = cat current.Items, Items
    current.Count += Count
    current.ScannedCount += ScannedCount
    current.LastEvaluatedKey = LastEvaluatedKey
    current.ConsumedCapacity = current.ConsumedCapacity.push ConsumedCapacity
    current


  query = curry (name, keyEx, filterEx, options={}, current) ->
    current = _setupCurrent() if !current

    p = {TableName: name}
    p.KeyConditionExpression = keyEx if keyEx
    p.FilterExpression = filterEx if filterEx
    p.ExclusiveStartKey = current.LastEvaluatedKey if current.LastEvaluatedKey
    results = await db.query merge p, options

    current = _catCurrent current, results
    if empty(LastEvaluatedKey) || options.Limit
      current
    else
      await query name, keyEx, filterEx, options, current

  scan = curry (name, filterEx, options={}, current) ->
    current = _setupCurrent() if !current

    p = {TableName: name}
    p.FilterExpression = filterEx if filterEx
    p.ExclusiveStartKey = current.LastEvaluatedKey if current.LastEvaluatedKey
    results = await db.query merge p, options

    current = _catCurrent current, results
    if empty(LastEvaluatedKey) || options.Limit
      current
    else
      await scan name, filterEx, options, current

    {tableGet, tableCreate, tableUpdate, tableDel, tableWaitForReady, tableWaitForDeleted, tableEmpty, get, put, update, del, query, scan}

export default DynamoDB
