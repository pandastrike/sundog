#===========================================================================
# Type Helpers
#===========================================================================
# DynamoDB includes type information mapped into its data strctures.
# It expects data to be input that way, and includes it when fetched.
# These helpers write and parse that type system.
import {curry, empty, isBoolean, isObject, keys} from "panda-parchment"
import {isObject, first, keys, values} from "panda-parchment"

_transform = (f) ->
  (x) ->
    if isObject x
      out = {}
      out[k] = _mark("anonymousDynamodbValue", f v) for k, v of x
      _mark "namedDynamodbValue", out
    else
      _mark "anonymousDynamodbValue", f x

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
  # Extension of DynamoDB types to stringify objects. *Must always be named.*
  JSON: _transform (o) -> S: JSON.stringify o

# This handles parsing on the data types native to DynamoDB, including recursive parsing on Maps.
_parse = (attributes) ->
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

# This wraps _parse to extend parsing to data types we define.
parse = curry (types, data) ->
  result = _parse data
  for name, type of types
    result[name] = switch type
      # NoOps on the base types
      when "S", "N", "BOOL", "SS", "L", "B", "NS", "BS", "NULL", "M"
        v
      # Extensions
      when "JSON"
        JSON.parse v
      else
        throw new Error "#{type} is not a known DynamoDB type or sundog extension."
  result

# Accept an incoming object to store in DynamoDB, rejecting fields that do not have a defined type or are not suitable for DynamoDB.
# From their docs:
# > Attribute values cannot be null. String and Binary type attributes must have lengths greater than zero. Set type attributes cannot be empty.
wrap = curry (types, data) ->
  out = {}
  for name, value of data
    if (type = types[name])? && value?
      switch type
        when "S", "SS", "L", "B", "NS", "BS"
          out[name] = to[type] value unless empty value
        when "N"
          out[name] = to[type] value unless Number.isNaN value
        when "BOOL", "NULL"
          out[name] = to[type] value if isBoolean value
        when "M"
          out[name] = to[type] value if (isObject value) && (!empty keys value)
        when "JSON"
          out[name] = to[type] value unless empty JSON.stringify value
  out

# Given data and a model definition, return the key for this object.
getKey = curry (definition, data) ->
  key = {}
  names = definition.key
  for name in names
    f = to[definition.types[name]]
    if isObject data
      key = merge key, f [name]: data[name]
    else
      key = merge key, f [name]: data


export default {to, parse, wrap, getKey}
export {to, parse, wrap, getKey}
