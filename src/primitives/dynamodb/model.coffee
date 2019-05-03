import {empty, first, second} from "panda-parchment"
import {to, wrap as _wrap, parse as _parse, getKey as _getKey} from "./helpers/types"
import {numberEx, updateEx as _updateEx, dropEx, qv} from "./helpers/expressions"
import Items from "./items"
import Queries from "./queries"

DynamoDB = (db) ->
  {get: getItem, put:putItem, del:deleteItem, update:updateItem} = Items db
  {query} = Queries db

  Model = (definition) ->
    {table} = definition
    parse = _parse definition.types
    wrap = _wrap definition.types
    getKey = _getKey definition
    updateEx = _updateEx definition

    # default interface for the model. "key" is allowed to be just the key or the whole data object
    get = (key) ->
      item = await getItem table, getKey key
      if item? then parse item else false
    put = (data) ->
      await putItem table, wrap data
    del = (key) ->
      await deleteItem table, getKey key
    update = (key, data, drop) ->
      await updateItem table, (getKey key), (updateEx data) + (dropEx drop)

    # "key" is allowed to be just the key or the whole data object
    increment = (key, field) ->
      await updateItem table, (getKey key), (numberEx field, 1)
    decrement = (key, field) ->
      await updateItem table, (getKey key), (numberEx field, -1)

    # Query interface for this table and its GSIs.
    queryTable = (keyEx, filterEx, options) ->
      await query table, filterEx, options
    queryIndex = (index, keyEx, filterEx, options) ->
      await query "#{table}:#{index}", keyEx, filterEx, options


    {
      parse, wrap, getKey
      get, put, del, update,
      increment, decrement,
      queryTable, queryIndex
    }

  {Model}

export default DynamoDB
