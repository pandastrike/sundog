import {empty, first} from "panda-parchment"
import {to, wrap as _wrap, parse as _parse, getKey as _getKey} from "./helpers/types"
import {numberEx, updateEx as _updateEx, dropEx, qv} from "./helpers/expressions"
import Items from "./items"
import Queries from "./queries"

DynamoDB = (db) ->
  {get, put, del, update} = Items db
  {query} = Queries db

  Model = (definition) ->
    {table} = definition
    parse = _parse definition.types
    wrap = _wrap definition.types
    getKey = _getKey definition
    updateEx = _updateEx definition

    {
      parse, wrap, getKey
      # "key" is allowed to be just the key or the whole data object
      increment: (key, field) ->
        await update table, (getKey key), (numberEx field, 1)
      decrement: (key, field) ->
        await update table, (getKey key), (numberEx field, -1)

      # default interface for the model. "key" is allowed to be just the key or the whole data object
      get: (key) ->
        chunks = []
        for name in definition.key
          f = to[definition.types[name]]
          chunks.push "#{name} = #{qv f [name]:key}"
        {Items} = await query table, (chunks.join " AND ")
        if empty Items
          false
        else
          parse first Items
      put: (data) ->
        await put table, wrap data
      del: (key) ->
        await del table, getKey key
      update: (key, data, drop) ->
        await update table, (getKey key), (updateEx data) + (dropEx drop)
    }



  {Model}

export default DynamoDB
