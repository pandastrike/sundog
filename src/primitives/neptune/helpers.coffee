#import {applyConfiguration} from "../lift"
import {curry} from "panda-garden"
import {keys, values} from "panda-parchment"

# Enforce the data model via an allowlist of fields.
upsert = curry (allowedProperties, data) ->
  query = ""
  for name, value of data when name in keys allowedProperties
    switch allowedProperties[name]
      when "string"
        query += ".property('#{name}', '#{value}')"
      when "integer"
        query += ".property('#{name}', #{value})"
      else
        throw new Error "Unable to upsert field '#{name}'. Unknown Neptune datatype, '#{value}'"
  query

range = curry (pageSize, page) ->
  start = pageSize * page
  end = pageSize * (page + 1)
  "range(#{start}, #{end})"


export default {upsert, range}
export {upsert, range}
