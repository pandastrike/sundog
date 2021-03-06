#===========================================================================
# Functions that act on Items
#===========================================================================
import {merge, empty} from "panda-parchment"
import {parseConditional} from "./helpers/expressions"

DynamoDB = (db) ->
  get = (name, key, options={}) ->
    {ReturnConsumedCapacity} = options
    p = {TableName: name, Key: key}
    {Item, ConsumedCapacity} = await db.getItem merge p, options
    if ReturnConsumedCapacity then {Item, ConsumedCapacity} else Item

  put = (name, item, options={}) ->
    p = {TableName: name, Item: item}
    await db.putItem merge p, options

  del = (name, key, options={}) ->
    p = {TableName: name, Key: key}
    await db.deleteItem merge p, options

  update = (name, key, updateEx, options={}) ->
    p = {TableName: name, Key: key}
    {result, values:_values} = parseConditional updateEx

    if (result && (!empty result))
      options.UpdateExpression = result 

    if (_values && (!empty _values))
      options.ExpressionAttributeValues = _values

    await db.updateItem merge p, options

  {get, put, del, update}

export default DynamoDB
