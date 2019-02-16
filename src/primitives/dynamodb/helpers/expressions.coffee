# Expression helpers make it easier to write the arcane string DSL that DynamoDB wants to achieve complex operations.
import {curry} from "panda-garden"
import {Method} from "panda-generics"
import {first, values, isFunction, isObject, empty} from "panda-parchment"
import {to} from "./types"

DELIMITER = "<###SUNDOGDYNAMODB###>"

parseConditional = (ex, count=0) ->
  return {result:false, values:false, count} if !ex
  Values = {}
  re = new RegExp "#{DELIMITER}.+?#{DELIMITER}", "g"

  result = ex.replace re, (match) ->
    [, obj] = match.split DELIMITER
    placeholder = ":param#{count}"
    count++
    Values[placeholder] = JSON.parse obj
    placeholder # Return placeholder to the expression we are processing.

  {result, values:Values, count}

# qv produces query strings with delimited values Sundog can parse.
_qv = (o) ->
  delimit = (s) -> "#{DELIMITER}#{s}#{DELIMITER}"
  # Determine if this is a DynamoDB value, and whether is anonymous or named.
  if o.name == "anonymousDynamodbValue"
    delimit JSON.stringify o
  else if o.name == "namedDynamodbValue"
    delimit JSON.stringify first values o
  else
    throw new Error "Unable to create stringified query value for unrecongied object #{JSON.stringify o}"

qv = Method.create default: (args...) ->
  console.error "sundog:dynamodb:qv, unable to match to method on", args
  throw new Error()
Method.define qv, isFunction, (f) -> (x) -> _qv f x
Method.define qv, isObject, (o) -> _qv o

numberEx = (field, amount) -> "ADD #{field} #{qv to.N amount}"

# Always pass qv a named element here to ensure JSON extended type works here.
updateEx = curry ({key, types}, data) ->
  chunks = []
  for k, v of data when k not in key
    continue unless v?

    type = types[k]
    throw new Error "#{k} does not have a type defined." if !type

    f = to[type]
    throw new Error "bad type: #{type}" unless f?
    
    switch type
      when "S", "SS", "L", "B", "NS", "BS"
        continue if empty value
      when "N"
        continue if Number.isNaN value
      when "BOOL", "NULL"
        continue unless isBoolean value
      when "M"
        continue unless (isObject value) && (!empty keys value)
      when "JSON"
        continue if empty JSON.stringify value
      when "SET"
        continue unless isType Set, value
      else
        throw new Error "bad update type conversion"

    chunks.push "#{k} = #{qv f {k:v}}"

  if !empty chunks
    "SET #{chunks.join(", ")}"
  else
    ""

dropEx = (drop) ->
  if drop && (!empty drop)
    " REMOVE #{drop.join(", ")}"  # The leading space is important!!
  else
    ""


export default {parseConditional, qv, updateEx, numberEx, dropEx}
export {
  parseConditional
  qv
  updateEx
  numberEx
  dropEx
}
