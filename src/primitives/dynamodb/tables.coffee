#===========================================================================
# Tables
#===========================================================================
import {curry} from "panda-garden"
import {merge, sleep, empty, difference, pick} from "panda-parchment"
import {collect, project} from "panda-river"
import {notFound} from "../utils"
import Queries from "./queries"

DynamoDB = (db) ->
  {scan} = Queries db

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
  keysFilter = curry (keys, item) ->
    f = (key) -> key in keys
    pick f, item

  tableEmpty = (name) ->
    {KeySchema} = await tableGet name
    filter = keysFilter collect project "AttributeName", KeySchema

    {Items} = await scan name
    await del name, filter(i) for i in Items

  {tableGet, tableCreate, tableUpdate, tableDel, tableWaitForReady, tableWaitForDeleted, keysFilter, tableEmpty}

export default DynamoDB
